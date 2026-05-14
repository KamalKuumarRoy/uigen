import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainContent } from "../main-content";

vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: any) => <>{children}</>,
  useFileSystem: () => ({
    getAllFiles: () => new Map(),
    refreshTrigger: 0,
  }),
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: any) => <>{children}</>,
  useChat: () => ({ messages: [], isLoading: false }),
}));

vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface" />,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree" />,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor" />,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame" />,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions" />,
}));

afterEach(() => {
  cleanup();
});

test("renders preview tab by default", () => {
  render(<MainContent />);
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("clicking the Code button switches from preview to code view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  expect(screen.getByTestId("preview-frame")).toBeDefined();

  const codeTab = screen.getByRole("tab", { name: /code/i });
  await user.click(codeTab);

  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
});

test("clicking the Preview button switches back from code to preview view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const codeTab = screen.getByRole("tab", { name: /code/i });
  const previewTab = screen.getByRole("tab", { name: /preview/i });

  await user.click(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  await user.click(previewTab);
  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("tabs can be toggled multiple times in succession", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const codeTab = screen.getByRole("tab", { name: /code/i });
  const previewTab = screen.getByRole("tab", { name: /preview/i });

  await user.click(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  await user.click(previewTab);
  expect(screen.getByTestId("preview-frame")).toBeDefined();

  await user.click(codeTab);
  expect(screen.getByTestId("code-editor")).toBeDefined();

  await user.click(previewTab);
  expect(screen.getByTestId("preview-frame")).toBeDefined();
});

test("tab triggers have cursor-pointer so they feel clickable", () => {
  render(<MainContent />);

  const codeTab = screen.getByRole("tab", { name: /code/i });
  const previewTab = screen.getByRole("tab", { name: /preview/i });

  expect(codeTab.className).toContain("cursor-pointer");
  expect(previewTab.className).toContain("cursor-pointer");
});
