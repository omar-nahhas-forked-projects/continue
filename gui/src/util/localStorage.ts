import { JSONContent } from "@tiptap/react";
import { OnboardingStatus } from "../components/OnboardingCard";

type LocalStorageTypes = {
  onboardingStatus?: OnboardingStatus;
  hasDismissedOnboardingCard: boolean;
  mainTextEntryCounter: number;
  ide: "vscode" | "jetbrains";
  ftc: number;
  fontSize: number;
  [key: `inputHistory_${string}`]: JSONContent[];
  extensionVersion: string;
  showTutorialCard: boolean;
  shownProfilesIntroduction: boolean;
  disableIndexing: boolean;
};

export function getLocalStorage<T extends keyof LocalStorageTypes>(
  key: T,
): LocalStorageTypes[T] | undefined {
  const value = localStorage.getItem(key);

  if (value === null) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(
      `Error parsing ${key} from local storage. Value was ${value}\n\n`,
      error,
    );
    return undefined;
  }
}

export function setLocalStorage<T extends keyof LocalStorageTypes>(
  key: T,
  value: LocalStorageTypes[T],
): void {
  localStorage.setItem(key, JSON.stringify(value));
}