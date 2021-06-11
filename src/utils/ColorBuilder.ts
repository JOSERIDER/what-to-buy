export class ColorBuilder {
  private static colors: string[] = [
    "#f64343",
    "#d74d74",
    "#9c79bd",
    "#6b6bfa",
    "#25A0C5",
    "#37e03f",
    "#5EAE9E",
  ];

  public static getRandomColor() {
    const color = this.rand(0, this.colors.length - 1, new Date().getTime());
    return this.colors[color];
  }

  private static rand(min, max, seed) {
    min = min || 0;
    max = max || 1;
    let rand;
    if (typeof seed === "number") {
      seed = (seed * 9301 + 49297) % 233280;
      let rnd = seed / 233280;
      const disp = Math.abs(Math.sin(seed));
      rnd = rnd + disp - Math.floor(rnd + disp);
      rand = Math.floor(min + rnd * (max - min + 1));
    } else {
      rand = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return rand;
  }
}
