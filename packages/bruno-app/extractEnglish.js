const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

async function extractEnglishTexts() {
  const componentsDir = path.join(__dirname, 'src/components');
  const outputFile = path.join(__dirname, 'src/i18n/translation/en.json');
  let result = {};

  // 确保输出目录存在
  const outputDir = path.dirname(outputFile);
  await fs.mkdir(outputDir, { recursive: true });

  // 读取现有的en.json文件内容
  try {
    const existingContent = await fs.readFile(outputFile, 'utf8');
    result = JSON.parse(existingContent);
  } catch (err) {
    // 如果文件不存在或读取失败，使用空对象
    if (err.code !== 'ENOENT') {
      console.error('Error reading en.json:', err);
    }
  }

  // 排除代码和样式的正则表达式
  const codePattern = /\{.*?\}|<[^>]*>|\(.*?\)|[+\-*/%=<>!&|[\]{};:`'"@#$,.?\\]/;
  const importRegex = /^import\s+.+?\s+from\s+['"].+?['"];$/gm;

  async function processDirectory(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(entryPath);
      } else if (entry.isFile() && ['.js', '.jsx', '.ts', '.tsx', '.html'].includes(path.extname(entry.name))) {
        await processFile(entryPath);
      }
    }
  }

  async function processFile(filePath) {
    if (!filePath.includes("Sidebar")) {
      return;
    }
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const $ = cheerio.load(content, {
        xmlMode: true,
        decodeEntities: false,
        recognizeSelfClosing: true,
        normalizeWhitespace: false
      });
      
      const relativeDir = path.relative(componentsDir, path.dirname(filePath)).replace(/\\/g, '/');
      const fileKey = relativeDir ? relativeDir.replace(/\//g, '_') : '_root';
      let modified = false;
      let newContent = content;
      
      // 标记是否需要添加导入和钩子
      let needsImport = !content.includes("import { useTranslation } from 'react-i18next'");
      let needsHook = false;
      
      // 检查是否有函数组件，确定是否需要添加钩子
      const functionPattern = /(function\s+\w+\s*\([^)]*\)|const\s+\w+\s*=\s*\([^)]*\)\s*=>)\s*{/;
      if (functionPattern.test(content) && !content.includes("const { t } = useTranslation();")) {
        needsHook = true;
      }

      // 使用改进的正则表达式处理标签
      ['span', 'div', 'label', 'button', 'h1', 'h2', 'h3', 'p'].forEach(tag => {
        const tagRegex = new RegExp(`(<${tag}(?:\\s+[a-zA-Z_:][a-zA-Z0-9_:.-]*=(?:"[^"]*"|'[^']*'|{[^}]*}))*\\s*>)(.*?)(</${tag}>)`, 'gs');
        
        let match;
        while ((match = tagRegex.exec(content)) !== null) {
          const fullMatch = match[0];
          const openingTag = match[1];
          const innerContent = match[2];
          const closingTag = match[3];
          
          // 跳过包含子标签的内容
          if (/<[^>]*>/.test(innerContent)) {
            continue;
          }
          
          // 去除首尾空白字符
          const text = innerContent.trim();
          
          // 检查是否符合英文文本条件
          if (
            /[a-zA-Z]/.test(text) && 
            !/[\u4e00-\u9fa5]/.test(text) && 
            text.length > 1 && 
            !codePattern.test(text)
          ) {
            // 进一步检查是否包含完整单词
            const words = text.match(/\b[a-zA-Z]+\b/g);
            if (words && words.length > 0 && words.join('').length > 0.7 * text.length) {
              // 生成安全的文本键
              const safeText = text
                .replace(/[^a-zA-Z0-9]/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '');
              
              // 添加到结果集
              if (!result[fileKey]) {
                result[fileKey] = {};
              }
              
              if (!result[fileKey][safeText]) {
                result[fileKey][safeText] = text;
              }
              
              // 生成i18nKey
              const i18nKey = `${fileKey}.${safeText}`;
              
              // 替换为t('key')格式
              const escapedKey = i18nKey.replace(/'/g, "\\'");
              const replacement = `{t('${escapedKey}')}`;
              
              // 只替换文本部分，保持标签和属性不变
              const newElementHtml = `${openingTag}${replacement}${closingTag}`;
              
              // 更新原始内容
              newContent = newContent.replace(fullMatch, newElementHtml);
              modified = true;
            }
          }
        }
      });

      // 如果文件被修改，保存更改
      if (modified) {
        // 添加useTranslation导入（如果需要）
        if (needsImport) {
          const useTranslationImport = "import { useTranslation } from 'react-i18next';";
          
          // 查找最后一个导入语句
          const importMatches = content.match(importRegex);
          if (importMatches && importMatches.length > 0) {
            const lastImport = importMatches[importMatches.length - 1];
            const lastImportIndex = content.lastIndexOf(lastImport);
            newContent = newContent.substring(0, lastImportIndex + lastImport.length) + 
                         '\n' + useTranslationImport + 
                         newContent.substring(lastImportIndex + lastImport.length);
          } else {
            // 如果没有导入语句，在文件开头添加
            newContent = `${useTranslationImport}\n${newContent}`;
          }
        }
        
        // 添加useTranslation钩子（如果需要）
        if (needsHook) {
          const useTranslationHook = "const { t } = useTranslation();";
          
          newContent = newContent.replace(
            functionPattern, 
            `$1 {\n  ${useTranslationHook}`
          );
        }
        
        await fs.writeFile(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    } catch (err) {
      console.error(`Error processing file ${filePath}:`, err);
    }
  }

  try {
    await processDirectory(componentsDir);
    await fs.writeFile(outputFile, JSON.stringify(result, null, 2));
    console.log('Extraction and replacement completed. Results saved to src/i18n/translation/en.json');
  } catch (err) {
    console.error('Error during extraction and replacement:', err);
  }
}

extractEnglishTexts();  