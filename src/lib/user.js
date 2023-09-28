import { writable } from "svelte/store"
import { nip19 } from "nostr-tools"

// user
const defaultUser = {
  pk: "",
  npub: "",
  profile: {},
  signer: {},
  sk: "",
}

function createUser() {
  const { subscribe, set, update } = writable(defaultUser)

  return {
    subscribe,
    set,
    update,
    setUser: async (ndk, pk, signer) => {
      const npub = nip19.npubEncode(pk)
      const nUser = ndk.getUser({ npub: npub })
      await nUser.fetchProfile()
      update(u => ({ ...u, pk: pk, npub: npub, profile: nUser.profile, signer }))
    },
    reset: () => {
      set(defaultUser)
    }
  }
}

export const user = createUser()

