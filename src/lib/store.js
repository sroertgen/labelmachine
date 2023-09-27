import { writable, get } from "svelte/store";
import { nanoid } from 'nanoid';
import { ndkStore } from "$lib/ndk";
import { user as userStore } from "$lib/user";
import { NDKPrivateKeySigner, NDKEvent } from "@nostr-dev-kit/ndk";

const ndk = get(ndkStore)

const createlabel = () => ({
  id: nanoid(),
  selectedType: 'What info to add?',
  topics: "",
  pubkey: '',
  label: "",
  labelNamespace: "",
});

export const labels = createLabels()

function createLabels() {
  const { subscribe, set, update } = writable([createlabel()])
  return {
    set,
    subscribe,
    update,
    addLabel: () => update((l) => {
      return [...l, createlabel()]
    }),
    updateLabel: (labelType, id, value) => {
      labels.update((l) => {
        const oldLabel = l.find((l) => l.id === id);
        const filtered = l.filter((l) => l.id !== id);
        return [...filtered, { ...oldLabel, [labelType]: value }]
      })
    },
    reset: () => set([createlabel()]),
    buildEvents: (eventId) => {
      let events;
      labels.subscribe((value) => {
        events = value.map(l => {
          if (l.selectedType == "Topic") {
            return [
              ["L", "#t"],
              ...(l.topics.split(",").map(t => ["l", t, "#t"])),
              ["e", eventId]
            ]
          } else if (l.selectedType == "Pubkey") {
            return [
              ["L", "#p"],
              ["l", l.pubkey, "#p"],
              ["e", eventId]
            ]
          } else if (l.selectedType == "Custom Label") {
            return [
              ["L", l.labelNamespace],
              ["l", l.label, l.labelNamespace],
              ["e", eventId]
            ]
          }
        })
      })
      return events
    },
    publishEvents: async () => {
      const user = get(userStore)
      const eventId = get(event).id
      const events = labels.buildEvents(eventId)
      const signer = new NDKPrivateKeySigner(user.pk);
      ndk.signer = signer
      for (let e of events) {
        const event = new NDKEvent(ndk);
        event.kind = 1985
        event.tags = e
        console.log(event)
        await event.publish()
      }
      return true
    }
  }
}

export const searchInput = writable("")


export const event = writable({})
