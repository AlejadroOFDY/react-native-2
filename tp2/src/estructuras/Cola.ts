export class Cola<T> {
  #items: T[] = [];
  #frente = 0;

  encolar(item: T): void {
    this.#items.push(item);
  }

  desencolar(): T | undefined {
    if (this.vacia) return undefined;
    const item = this.#items[this.#frente];
    this.#items[this.#frente] = undefined as unknown as T;
    this.#frente += 1;
    if (this.#frente > 32 && this.#frente * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#frente);
      this.#frente = 0;
    }
    return item;
  }

  frente(): T | undefined {
    return this.vacia ? undefined : this.#items[this.#frente];
  }

  get vacia(): boolean {
    return this.#frente >= this.#items.length;
  }

  get tamanio(): number {
    return this.#items.length - this.#frente;
  }

  aArray(): T[] {
    return this.#items.slice(this.#frente);
  }
}
