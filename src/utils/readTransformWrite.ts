import fs from 'fs';


type TransformFn = (raw: string) => string;

/* Read from the source, apply the transform, and write to the target. */
export function readTransformWrite(source: string, target: string = source, transformFn?: TransformFn): void {
  /* Read contents from the source file */
  const original = fs.readFileSync(source, 'utf-8');

  /* Transform the contents */
  const transformed = transformFn ? transformFn(original) : original;

  /* Write to the target file */
  fs.writeFileSync(target, transformed);
}
