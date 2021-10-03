import {
  BaseSource,
  Candidate,
  DdcOptions,
  SourceOptions,
} from "https://deno.land/x/ddc_vim@v0.13.0/types.ts#^";
import {
  assertEquals,
  Denops,
  fn,
} from "https://deno.land/x/ddc_vim@v0.13.0/deps.ts#^";

type Params = {};

function formatWords(words: string[]): string[] {
  function formatWord(word: string): string {
    return word.split('\n')[0].trim()
  }
  function unique(words: string[]) {
    return Array.from(new Set(words));
  }
  return unique(words.map((word) => formatWord(word)))
}

async function gatherYankRegisterWords(denops: Denops): Promise<string[]> {
  const yankRegisters: string[] = [
    '"',
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  return Promise.all(
    yankRegisters.map((reg) => fn.getreg(denops, reg) as Promise<string>),
  );
}

export class Source extends BaseSource<Params> {
  async gatherCandidates(args: {
    denops: Denops;
    options: DdcOptions;
    sourceOptions: SourceOptions;
    sourceParams: Params;
    completeStr: string;
  }): Promise<Candidate[]> {
    const words: string[] = formatWords(
      await gatherYankRegisterWords(args.denops),
    );
    return words.map<Candidate>((word) => ({ word }));
  }

  params(): Params {
    return {};
  }
}

Deno.test("formatWords", () => assertEquals(formatWords([]), []));
Deno.test("formatWords_removeDuplicate", () => assertEquals(formatWords(['a', 'a']), ['a']));
Deno.test("formatWords_trim", () => assertEquals(formatWords([' hello world ']), ['hello world']));
Deno.test("formatWords_multilineItem_onlyUseFirstLine", () => assertEquals(formatWords(["test1\ntest2"]), ['test1']));
