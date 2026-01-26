export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}

export function splitImageBySentences(
  img: HTMLImageElement,
  sentences: { textExample: string }[],
) {
  const sentenceHeight = img.height / sentences.length;
  const fragments: {
    sentenceIndex: number;
    word: string;
    canvas: HTMLCanvasElement;
  }[] = [];

  sentences.forEach((sentence, sIdx) => {
    const words = sentence.textExample.split(' ');

    const lengths = words.map((w) => w.length);
    const totalLength = lengths.reduce((a, b) => a + b, 0);
    const wordWidths = lengths.map((l) => (l / totalLength) * img.width);

    let xStart = 0;
    const yStart = sIdx * sentenceHeight;

    words.forEach((word, wIdx) => {
      const wWidth = wordWidths[wIdx];
      const canvas = document.createElement('canvas');
      canvas.width = wWidth;
      canvas.height = sentenceHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(
        img,
        xStart,
        yStart,
        wWidth,
        sentenceHeight,
        0,
        0,
        wWidth,
        sentenceHeight,
      );

      fragments.push({ sentenceIndex: sIdx, word, canvas });

      xStart += wWidth;
    });
  });

  return fragments;
}
