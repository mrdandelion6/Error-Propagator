import { Parser } from "expr-eval";

export function validateEquation(eqn: string, vars: string[]): string {
  const p = new Parser();
  try {
    const parsed = p.parse(eqn);
    const variables = parsed.variables();
    const unknownVars = variables.filter((v: string) => !vars.includes(v));
    if (unknownVars.length === 1) {
      return `Unknown variable: ${unknownVars[0]}`;
    }
    if (unknownVars.length > 1) {
      return `Unknown variables: ${unknownVars.join(', ')}`;
    }
    return ''; // no errors
  } catch (error) {
    return '';
  }
}