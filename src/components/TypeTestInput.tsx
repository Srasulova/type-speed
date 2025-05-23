import { Component, createSignal, JSX } from 'solid-js';

const TypingTest: Component = () => {
  const text = `function add(a: number, b: number): number {
    return a + b;
  }
  
  const numbers = [1, 2, 3, 4, 5];
  for (const n of numbers) {
    console.log(\`add(\${n}, 10) = \${add(n, 10)}\`);
  }`;

   // `input` stores the current user-typed string
  // `setInput` updates the `input` signal
  const [input, setInput] = createSignal("");
  // `typedIndices` is a set of positions the user has typed (or auto-advanced)
  // `setTypedIndices` updates that set
  const [typedIndices, setTypedIndices] = createSignal<Set<number>>(new Set());

  // Handler for input events (typing or pasting)
  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = e => {
    // `newValue` is the full new textarea value
    const newValue = e.currentTarget.value;
    // `prevValue` is the previous input value from state
    const prevValue = input();

    // If the new value is shorter or same length, user deleted or nothing changed
    if (newValue.length <= prevValue.length) {
      setInput(newValue); // just sync state
      return;
    }

    // `idx` is the index where the new character was added
    const idx = prevValue.length;
    // Clone the typedIndices set to add new indexes
    const nextSet = new Set(typedIndices());

    // If the next character in `text` is a newline, handle multi-line jump
    if (text[idx] === "\n") {
      // find the next non-whitespace / non-empty line start
      let nextIdx = idx + 1;
      while (nextIdx < text.length) {
        if (text[nextIdx] === "\n" || text[nextIdx] === " " || text[nextIdx] === "\t") {
          nextIdx++;
        } else {
          break;
        }
      }
      // Mark all skipped positions as "typed"
      for (let i = idx; i < nextIdx; i++) {
        nextSet.add(i);
      }
      // Build new input up to that next index, preserving typed char
      const typed = newValue[idx];
      const updated = text.substring(0, nextIdx) + typed;
      setTypedIndices(nextSet);
      setInput(updated);
      return;
    }

    // Otherwise it's a normal character in the same line
    nextSet.add(idx); // mark this position typed
    setTypedIndices(nextSet);
    setInput(newValue);    // update state with newValue value
  };

  // Handler for keydown events to catch Space or Enter at line end
  const handleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = e => {
    // If the pressed key is Space or Enter
    if (e.key === " " || e.key === "Enter") {
      const prevValue = input();         // current input value
      const idx = prevValue.length;      // current caret index
      // Only proceed if the next char in `text` is newline
      if (text[idx] === "\n") {
        e.preventDefault();         // prevent default space/enter behavior
        // find end of indentation / empty lines
        let nextIdx = idx + 1;
        while (nextIdx < text.length) {
          if (text[nextIdx] === "\n" || text[nextIdx] === " " || text[nextIdx] === "\t") {
            nextIdx++;
          } else {
            break;
          }
        }
        // Mark those jumped indices typed
        const nextSet = new Set(typedIndices());
        for (let i = idx; i < nextIdx; i++) {
          nextSet.add(i);
        }
        // Update state to new position
        setTypedIndices(nextSet);
        setInput(text.substring(0, nextIdx));
      }
    }
  };

  // JSX return: overlay of <pre> showing colored chars, with a transparent <textarea> on top
  return (
    <div class="relative font-mono text-lg leading-snug w-full max-w-xl mx-auto p-2">
      {/* Render each char with color based on typedIndices */}
      <pre class="whitespace-pre-wrap">
        {text.split("").map((char, i) => {
          // If index not yet typed, show gray
          if (!typedIndices().has(i)) {
            return <span class="text-gray-400">{char}</span>;
          }
          // Otherwise compare input vs text to choose green or red
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
      {/* Transparent textarea captures input events */}
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
