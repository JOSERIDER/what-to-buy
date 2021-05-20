export class ColorBuilder {
  private static colors: string[] = [
    "#FF2626",
    "#D73E68",
    "#B300B3",
    "#8D18AB",
    "#5B5BFF",
    "#25A0C5",
    "#5EAE9E",
  ];

  public static getRandomColor() {
    const color = Math.floor(Math.random() * this.colors.length);
    return this.colors[color];
  }
}
