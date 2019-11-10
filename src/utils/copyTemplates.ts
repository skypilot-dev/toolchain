/* -- Imports -- */
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';


/* -- Typings -- */
type Transformer = (rawTemplate: string) => string;

interface CopyTemplateOptions {
  sourcePath: string;
  targetPath: string;
  transform?: Transformer;
}

export interface CopyTemplatesOptions {
  sourceDir: string;
  targetDir: string;
  templates: TemplateData[];
  transform?: Transformer;
}

interface TemplateData {
  inFile: string;
  outFile?: string;
}

/* -- Functions -- */
/* Read the sourcePath, apply the transform function, and write the result to the targetPath. */
export function readTransformWriteTemplate(options: CopyTemplateOptions): void {
  const { sourcePath, targetPath, transform } = options;

  /* Read the file */
  const rawTemplate = readFileSync(sourcePath, 'utf-8');

  /* Transform the file */
  const renderedTemplate = (transform ? transform(rawTemplate) : rawTemplate);

  /* Write the file */
  writeFileSync(targetPath, renderedTemplate);
}

/* Copy templates from sourcePath to destination */
export function copyTemplates(options: CopyTemplatesOptions): void {
  const { sourceDir, targetDir, templates, transform } = options;

  /* Copy each template */
  templates.forEach(({ inFile, outFile = inFile }) => {
    const sourcePath = path.join(sourceDir, inFile);
    const targetPath = path.join(targetDir, outFile);
    if (transform) {
      readTransformWriteTemplate({ sourcePath: sourcePath, targetPath: targetPath, transform });
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  });
}
