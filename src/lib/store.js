import { writable, get } from "svelte/store";
import { nanoid } from 'nanoid';
import { ndkStore } from "$lib/ndk";
import { user as userStore } from "$lib/user";
import { NDKPrivateKeySigner, NDKEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk";

/**
 * @typedef {Object} Label
 * @property {string} id
 * @property {"Topic"|"Pubkey"|"Custom Label"} selectedType
 * @property {string} topics
 * @property {string} pubkey
 * @property {string} label
 * @property {string} labelNamespace
 */
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
    /**
     * Creates a new label in appends it to label store
     * @returns {Label} - newly created label
     */
    addLabel: () => {
      const newLabel = createlabel()
      labels.update(l => ([...l, newLabel]))
      return newLabel
    },
    /**
     * TODO this needs cleanup
     * @param {"topics"|"pubkey"|"labelNamespace"|"label"} labelType
     * @param {string} id
     * @param {string} value
     * @retuns {Array}
     */
    updateLabel: (labelType, id, value) => {
      labels.update((l) => {
        const oldLabel = l.find((l) => l.id === id);
        const filtered = l.filter((l) => l.id !== id);
        const selectedType = labelType === "topics"
          ? "Topic"
          : labelType === "pubkey"
            ? "Pubkey"
            : labelType === "labelNamespace"
              ? "Custom Label"
              : "Custom Label"
        return [...filtered, { ...oldLabel, selectedType, [labelType]: value }]
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
      const labelTarget = {
        event: ['e', id],
        pubkey: ['p', id],
        webresource: ['r', id]
      };

      labels.subscribe((value) => {
        events = value.filter(v => v.selectedType !== "What info to add?").map(l => {
          if (l.selectedType == "Topic") {
            return [
              ["L", "#t"],
              ...(l.topics.split(",").map(t => ["l", t, "#t"])),
              labelTarget[type]
            ]
          } else if (l.selectedType == "Pubkey") {
            return [
              ["L", "#p"],
              ["l", l.pubkey, "#p"],
              labelTarget[type]
            ]
          } else if (l.selectedType == "Custom Label") {
            return [
              ["L", l.labelNamespace],
              ["l", l.label, l.labelNamespace],
              labelTarget[type]
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


