import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrowserSerializedContinueConfig } from "core";
import { ConfigResult } from "core/config/load";
import { ConfigValidationError } from "core/config/validation";
import { DEFAULT_MAX_TOKENS } from "core/llm/constants";

export type ConfigState = {
  configError: ConfigValidationError[] | undefined;
  config: BrowserSerializedContinueConfig;
  defaultModelTitle: string;
};

const initialState: ConfigState = {
  configError: undefined,
  defaultModelTitle: "GPT-4",
  config: {
    slashCommands: [
      {
        name: "share",
        description: "Export the current chat session to markdown",
      },
      {
        name: "cmd",
        description: "Generate a shell command",
      },
    ],
    contextProviders: [],
    models: [],
    tools: [],
  },
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfigResult: (
      state,
      {
        payload: result,
      }: PayloadAction<ConfigResult<BrowserSerializedContinueConfig>>,
    ) => {
      const { config, errors } = result;
      state.configError = errors;

      if (!config) {
        return;
      }

      const defaultModelTitle =
        config.models.find((model) => model.title === state.defaultModelTitle)
          ?.title ||
        config.models[0]?.title ||
        "";
      state.config = config;
      state.defaultModelTitle = defaultModelTitle;
    },
    setConfigError: (
      state,
      { payload: error }: PayloadAction<ConfigValidationError[] | undefined>,
    ) => {
      state.configError = error;
    },
    setDefaultModel: (
      state,
      { payload }: PayloadAction<{ title: string; force?: boolean }>,
    ) => {
      const model = state.config.models.find(
        (model) => model.title === payload.title,
      );
      if (!model && !payload.force) return;
      return {
        ...state,
        defaultModelTitle: payload.title,
      };
    },
  },
  selectors: {
    selectDefaultModel: (state) => {
      return state.config.models.find(
        (model) => model.title === state.defaultModelTitle,
      );
    },
    selectDefaultModelContextLength: (state): number => {
      return (
        configSlice.getSelectors().selectDefaultModel(state)?.contextLength ||
        DEFAULT_MAX_TOKENS
      );
    },
    selectUIConfig: (state) => {
      return state.config?.ui ?? null;
    },
  },
});

export const { setDefaultModel, setConfigResult, setConfigError } =
  configSlice.actions;

export const {
  selectDefaultModel,
  selectDefaultModelContextLength,
  selectUIConfig,
} = configSlice.selectors;

export default configSlice.reducer;