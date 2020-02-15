/* Given template strings and arguments, concatenate them and return the result. This function
 * exists to simulate the default template literal behaviour inside a tag function. */

/* This function is copied, rather than imported, from `@skypilot/sugarbowl` to avoid creating
 * a cyclic dependency. */

/* TODO: Check whether there exists a native replacement for this function. */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function renderTemplateLiteral(templateStrings: TemplateStringsArray, args: any[]): string {
  if (args.length === 0) {
    return templateStrings.map(line => line).join('');
  }
  const strings: string[] = [];
  for (let i = 0; i < args.length; i += 1) {
    const templateString = templateStrings[i];
    const arg = args[i];
    strings.push(`${templateString}${arg}`);
  }
  /* There will always be one more template string than the number of args. */
  const lastTemplateString = templateStrings[templateStrings.length - 1];
  strings.push(lastTemplateString);
  return strings.join('');
}
