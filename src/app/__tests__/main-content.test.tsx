import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainContent } from "@/app/main-content";

vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: any) => <>{children}</>,
  useFileSystem: () => ({
    getAllFiles: () => new Map(),
    refreshTrigger: 0,
    selectedFile: null,
    getFileContent: () => "",
    updateFile: vi.fn(),
  }),
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: any) => <>{children}</>,
  useChat: () => ({
    messages: [],
    input: "",
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat</div>,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">FileTree</div>,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">CodeEditor</div>,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">PreviewFrame</div>,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">Header</div>,
}));

vi.mock("@/components/ui/resizable", () => ({
  ResizablePanelGroup: ({ children }: any) => <div>{children}</div>,
  ResizablePanel: ({ children }: any) => <div>{children}</div>,
  ResizableHandle: () => <div />,
}));

afterEach(() => {
  cleanup();
});

test("renders Preview view by default", () => {
  render(<MainContent />);
  expect(screen.getByTestId("preview-frame")).toBeTruthy();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("clicking the Code tab switches to the code view", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  expect(screen.getByTestId("preview-frame")).toBeTruthy();

  await user.click(screen.getByRole("tab", { name: /code/i }));

  expect(screen.getByTestId("code-editor")).toBeTruthy();
  expect(screen.getByTestId("file-tree")).toBeTruthy();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
});

test("clicking the Preview tab switches back to preview", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  await user.click(screen.getByRole("tab", { name: /code/i }));
  expect(screen.getByTestId("code-editor")).toBeTruthy();

  await user.click(screen.getByRole("tab", { name: /preview/i }));

  expect(screen.getByTestId("preview-frame")).toBeTruthy();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("active tab has data-state=active attribute", async () => {
  const user = userEvent.setup();
  render(<MainContent />);

  const previewTab = screen.getByRole("tab", { name: /preview/i });
  const codeTab = screen.getByRole("tab", { name: /code/i });

  expect(previewTab.getAttribute("data-state")).toBe("active");
  expect(codeTab.getAttribute("data-state")).toBe("inactive");

  await user.click(codeTab);

  expect(codeTab.getAttribute("data-state")).toBe("active");
  expect(previewTab.getAttribute("data-state")).toBe("inactive");
});
