export function parseInstructions(instructions: string): string[] {
  return (
    instructions
      .match(/Step \d+\..*?(?=Step \d+\.|$)/g)
      ?.map((step) => step.replace(/^Step \d+\.\s*/, "").trim())
      .filter(Boolean) ?? []
  );
}
