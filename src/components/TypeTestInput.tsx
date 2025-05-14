import { Component, createSignal, JSX } from 'solid-js';

const TypingTest: Component = () => {
  const text = `function add(a: number, b: number): number {
    return a + b;
  }
  
  const numbers = [1, 2, 3, 4, 5];
  for (const n of numbers) {
    console.log(\`add(\${n}, 10) = \${add(n, 10)}\`);
  }`;

  const [input, setInput] = createSignal("");
  const [typedIndices, setTypedIndices] = createSignal<Set<number>>(new Set());

  // Handle normal typing + auto-newline+letter
  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = e => {
    const raw = e.currentTarget.value;
    const prev = input();

    // Deletions or no growth → just sync
    if (raw.length <= prev.length) {
      setInput(raw);
      return;
    }

    const idx = prev.length;
    const nextSet = new Set(typedIndices());

    // If the next source-char is a newline, auto-inject it + their letter
    if (text[idx] === "\n") {
      const typed = raw[idx]; // what they actually pressed
      const updated = prev + "\n" + typed;
      nextSet.add(idx + 1);   // mark their letter as typed
      setTypedIndices(nextSet);
      setInput(updated);
      return;
    }

    // Otherwise it's just a normal in-line keystroke
    nextSet.add(idx);
    setTypedIndices(nextSet);
    setInput(raw);
  };

  // Intercept SPACE when right before a newline:
  // inject only the newline, so caret moves to next line’s first slot
  const handleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = e => {
    if (e.key === " " || e.key === "Enter") {
      const prev = input();
      const idx = prev.length;
      if (text[idx] === "\n") {
        e.preventDefault();
        setInput(prev + "\n");
      }
    }
  };

  return (
    <div class="relative font-mono text-lg leading-snug w-full max-w-xl mx-auto p-2">
      <pre class="whitespace-pre-wrap">
        {text.split("").map((char, i) => {
          if (!typedIndices().has(i)) {
            return <span class="text-gray-400">{char}</span>;
          }
          return (
            <span class={
              input()[i] === char
                ? "text-green-500"
                : "text-red-500"
            }>
              {char}
            </span>
          );
        })}
      </pre>
      <textarea
        class="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-black outline-none resize-none border border-gray-400 rounded p-2"
        rows={8}
        maxlength={text.length}
        value={input()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TypingTest;
