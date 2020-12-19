/* This function is copied, rather than imported, from `@skypilot/sugarbowl` to avoid creating
 * a cyclic dependency. */

import { Integer } from '../types';
import { countLeadingSpaces } from './countLeadingSpaces';
import { renderTemplateLiteral } from './renderTemplateLiteral';

function getMinimumIndentSize(lines: string[]): Integer {
  const [firstLine] = lines;
  const indentSize = countLeadingSpaces(firstLine);
  return lines
    .reduce((minSize, line) => Math.min(countLeadingSpaces(line), minSize), indentSize);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deindentTemplateLiteral(template: TemplateStringsArray, ...args: any[]): string {
  const lines = renderTemplateLiteral(template, args).split('\n');
  // const lines = template.join('').split('\n');

  if (lines.length < 2) {
    return lines.join('\n');
  }

  const [firstLine] = lines;
  if (firstLine.trimRight().length === 0) {
    lines.shift();
  } else {
    throw new Error('deIndentTemplateString does not accept a nonempty first line');
  }

  const minIndentSize = getMinimumIndentSize(lines);

  return lines
    .map(line => line.slice(minIndentSize))
    .join('\n');
}
