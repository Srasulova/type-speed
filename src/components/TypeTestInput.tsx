import { Component, createSignal } from 'solid-js';

const TypingTest: Component = () => {
    const text = `The quick brown fox
jumps over the lazy dog.
Type Speed Race.`;
    const [input, setInput] = createSignal("");

    return (
        <div class="relative font-mono text-lg leading-snug w-full max-w-xl mx-auto p-2">
            <pre class="whitespace-pre-wrap">
                {text.split("").map((char, i) => {
                    const typed = input()[i];
                    const cls = typed == null
                        ? "text-gray-400"
                        : typed === char
                            ? "text-green-500"
                            : "text-red-500";
                    return <span class={cls}>{char}</span>;
                })}
            </pre>
            <textarea
                class="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-black outline-none resize-none border border-gray-400 rounded p-2"
                rows={3}
                maxlength={text.length}
                value={input()}
                onInput={e => setInput(e.currentTarget.value)}
            />
        </div>
    );
};

export default TypingTest;