import { fileOpen } from 'browser-fs-access';
import * as marked from 'marked';
import fitty from 'fitty';

const openButton = document.getElementById("open-button");
const teleprompter = document.getElementById("teleprompter");

if (!openButton || !teleprompter) {
    throw "Something wrong";
}

const RESIZE_INTERVAL = 0.1;

openButton.addEventListener("click", async function () {
    const blob = await fileOpen([
        {
            description: "Text files",
            mimeTypes: ['text/plain'],
            extensions: ['.txt']
        },
        {
            description: "Markdown files",
            mimeTypes: ['text/plain'],
            extensions: [".md"]
        }
    ]);

    let text = await blob.text();
    openButton.style.display = "none";

    // If it's markdown, render it
    // NOTE: No sanitization of content is done.
    if (blob.name.endsWith(".md")) {
        text = marked.parse(text);
    }

    teleprompter.innerHTML = text;

    // Automatically adjust the size
    fitty('#' + teleprompter.id, {minSize: 35});

    document.title += ` - ${blob.name}`;
});

addEventListener("keydown", event => {
    const scrollInterval = window.innerHeight * 0.15;
    const fontSize = parseFloat(teleprompter.style.fontSize);

    switch (event.key) {
        case "ArrowUp":
            event.preventDefault();
            window.scrollBy({ top: -scrollInterval, behavior: "smooth"});
            break;
        case "ArrowDown":
            event.preventDefault();
            window.scrollBy({ top: scrollInterval, behavior: "smooth"});
            break;
        case "+":
        case "=":
            event.preventDefault();
            teleprompter.style.fontSize = `${fontSize * (1 + RESIZE_INTERVAL)}px`;
            break;
        case "-":
        case "_":
            event.preventDefault();
            teleprompter.style.fontSize = `${fontSize * (1 - RESIZE_INTERVAL)}px`;
            break;
    }
});
