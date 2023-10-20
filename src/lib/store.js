import { writable, get } from "svelte/store";
import { nanoid } from 'nanoid';
import { ndkStore } from "$lib/ndk";
import { user as userStore } from "$lib/user";
import { NDKPrivateKeySigner, NDKEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk";


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
    /**
      * @param {string} id - The ID of the event.
      * @param {("event"|"pubkey"|"webresource")} type - The type of the thingToLabel
     * @returns {Array<string[]>} - An array of arrays containing the labels for the event.
     */
    buildEventLabels: (id, type) => {
      /** @type {Array<string[]>} */
      let events = [];
      let labelTarget = [];
      if (type === "event") {
        labelTarget = ["e", id];
      } else if (type === "pubkey") {
        labelTarget = ["p", id];
      } else if (type === "webresource") {
        labelTarget = ["r", id];
      }

      labels.subscribe((value) => {
        events = value.map(l => {
          if (l.selectedType == "Topic") {
            return [
              ["L", "#t"],
              ...(l.topics.split(",").map(t => ["l", t, "#t"])),
              labelTarget
            ]
          } else if (l.selectedType == "Pubkey") {
            return [
              ["L", "#p"],
              ["l", l.pubkey, "#p"],
              labelTarget
            ]
          } else if (l.selectedType == "Custom Label") {
            return [
              ["L", l.labelNamespace],
              ["l", l.label, l.labelNamespace],
              labelTarget
            ]
          }
        })
      })
      return events
    },
    publishEvents: async () => {
      const publishedEvents = []
      const ndk = get(ndkStore)
      const user = get(userStore)
      // TODO how to handle publishing random links?
      // maybe the resource is an actor itself?
      // maybe just add the url as an `r` tag
      let referenceId;
      /** @type {Array<string[]>} */
      let labelEvents = [];
      if (get(thingToLabel).kind === 1) {
        referenceId = get(thingToLabel).id
        labelEvents = labels.buildEventLabels(referenceId, "event")
        console.log("event")
      } else if (get(thingToLabel)._hexpubkey) {
        console.log("person")
        referenceId = get(thingToLabel)._hexpubkey
        labelEvents = labels.buildEventLabels(referenceId, "pubkey")
      } else if (get(thingToLabel).content) {
        console.log("article")
        referenceId = get(thingToLabel).url
        labelEvents = labels.buildEventLabels(referenceId, "webresource")
      }
      ndk.signer = user.signer;
      user.signer.user().then(async (user) => {
        if (!!user.npub) {
          console.log("Permission granted to read their public key:", user.npub);
        }
      });
      for await (const e of labelEvents) {
        const event = new NDKEvent(ndk);
        event.kind = 1985
        event.tags = e
        event.publish()
        console.log(event)
        publishedEvents.push(event)
      }
      return publishedEvents
    }
  }
}

export const searchInput = writable("")

export const thingToLabel = writable({})

export const assignedLabels = writable([])


