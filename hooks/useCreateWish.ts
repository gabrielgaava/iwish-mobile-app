/**
 * useCreateWish
 *
 * Store leve para pré-preencher a tela de criação de wish.
 * Funciona como um "pass-through": quem quer navegar para wish/create
 * chama setPrefill() antes de navegar; a tela chama consumePrefill()
 * no mount e o dado é apagado automaticamente.
 *
 * Usado por:
 *  - Home screen (input de link rápido)
 *  - Share Intent listener (root layout)
 */

export type WishPrefill = {
  link: string;
  title: string;
  price: string;
  images: string[];
};

let _prefill: WishPrefill | null = null;

export function useCreateWish() {
  function setPrefill(data: WishPrefill) {
    _prefill = data;
  }

  /** Lê e apaga o prefill. Deve ser chamado apenas pela tela wish/create. */
  function consumePrefill(): WishPrefill | null {
    const data = _prefill;
    _prefill = null;
    return data;
  }

  function hasPrefill(): boolean {
    return _prefill !== null;
  }

  return { setPrefill, consumePrefill, hasPrefill };
}
