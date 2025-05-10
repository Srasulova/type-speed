import { Component, createSignal, JSX } from 'solid-js';

const TypingTest: Component = () => {
  const text = `The quick brown fox
jumps over the lazy dog.
Type Speed Race.`;

  const [input, setInput] = createSignal("");
  // A set of text-indexes the user actually typed (not the auto-injected newline)
  const [typedIndices, setTypedIndices] = createSignal<Set<number>>(new Set());

  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = e => {
    const raw = e.currentTarget.value;
    const prev = input();
    let updated = raw;

    // clone our “typed” set so we can add to it
    const nextSet = new Set(typedIndices());

    if (raw.length > prev.length) {
      const idx = prev.length;
      // if we need to auto-inject a newline…
      if (text[idx] === "\n" && raw[idx] !== "\n") {
        const nextChar = raw[idx];
        updated = prev + "\n" + nextChar + raw.slice(idx + 1);
        // record that the user really typed at index idx+1
        nextSet.add(idx + 1);
      } else {
        // normal character, record at idx
        nextSet.add(idx);
      }
    }

    setTypedIndices(nextSet);
    setInput(updated);
  };

  return (
    <div class="relative font-mono text-lg leading-snug w-full max-w-xl mx-auto p-2">
      <pre class="whitespace-pre-wrap">
        {text.split("").map((char, i) => {
          // if the user never typed here, stay gray
          if (!typedIndices().has(i)) {
            return <span class="text-gray-400">{char}</span>;
          }
          // otherwise compare for green/red
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
        rows={5}
        maxlength={text.length}
        value={input()}
        onInput={handleInput}
      />
    </div>
  );
};

export default TypingTest;
