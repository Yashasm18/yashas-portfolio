// Simple text splitter utility to replace GSAP SplitText
export class TextSplitter {
  chars = [];
  words = [];
  lines = [];
  elements = [];
  selector;
  originalHTML = new Map();

  constructor(target, vars) {
    const type = vars?.type || "chars,words,lines";
    const linesClass = vars?.linesClass || "split-line";

    // Get elements
    let elements = [];
    if (typeof target === "string") {
      elements = Array.from(document.querySelectorAll(target));
    } else if (target instanceof NodeList) {
      elements = Array.from(target);
    } else if (Array.isArray(target)) {
      elements = target;
    } else {
      elements = [target];
    }

    this.selector = typeof target === "string" ? target : "";
    this.elements = elements;

    elements.forEach((element) => {
      // Store original HTML for revert
      this.originalHTML.set(element, element.innerHTML);

      if (type.includes("chars") && type.includes("words")) {
        this.splitWords(element);
        this.splitCharsFromWords(element);
      } else if (type.includes("chars")) {
        this.splitChars(element);
      } else if (type.includes("words")) {
        this.splitWords(element);
      }

      if (type.includes("lines")) {
        this.splitLines(element, linesClass);
      }
    });
  }

  splitChars(element) {
    const text = element.textContent || "";
    const chars = text.split("");

    element.innerHTML = chars
      .map((char) => {
        if (char === " ") {
          return '<span class="split-char"> </span>';
        }
        if (char === "\n") {
          return "<br>";
        }
        return `<span class="split-char">${char}</span>`;
      })
      .join("");

    this.chars.push(...Array.from(element.querySelectorAll(".split-char")));
  }

  splitWords(element) {
    const text = element.textContent || "";
    const words = text.split(/(\s+)/);

    element.innerHTML = words
      .map((word) => {
        if (word.trim().length === 0) {
          return word;
        }
        return `<span class="split-word">${word}</span>`;
      })
      .join("");

    this.words.push(...Array.from(element.querySelectorAll(".split-word")));
  }

  splitCharsFromWords(element) {
    const words = element.querySelectorAll(".split-word");
    words.forEach((word) => {
      const text = word.textContent || "";
      const chars = text.split("");
      word.innerHTML = chars
        .map((char) => `<span class="split-char">${char}</span>`)
        .join("");
      this.chars.push(...Array.from(word.querySelectorAll(".split-char")));
    });
  }

  splitLines(element, linesClass) {
    requestAnimationFrame(() => {
      const items = element.querySelectorAll(".split-word, .split-char");
      if (items.length === 0) return;

      let currentLine = [];
      let lines = [];
      let currentTop = 0;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (currentTop === 0) {
          currentTop = rect.top;
        }

        if (Math.abs(rect.top - currentTop) > 5) {
          if (currentLine.length > 0) {
            lines.push([...currentLine]);
          }
          currentLine = [item];
          currentTop = rect.top;
        } else {
          currentLine.push(item);
        }
      });

      if (currentLine.length > 0) {
        lines.push(currentLine);
      }

      lines.forEach((line) => {
        if (line.length === 0) return;
        const lineWrapper = document.createElement("span");
        lineWrapper.className = linesClass;
        lineWrapper.style.display = "block";
        const firstItem = line[0];
        firstItem.parentNode?.insertBefore(lineWrapper, firstItem);
        line.forEach((item) => {
          if (item.parentNode === lineWrapper.parentNode) {
            lineWrapper.appendChild(item);
          }
        });
      });

      this.lines.push(...Array.from(element.querySelectorAll(`.${linesClass}`)));
    });
  }

  revert() {
    this.elements.forEach((element) => {
      const original = this.originalHTML.get(element);
      if (original !== undefined) {
        element.innerHTML = original;
      }
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
    this.originalHTML.clear();
  }
}
