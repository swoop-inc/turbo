import { FrameElement } from "../../elements/frame_element"
import { MorphingFrameRenderer } from "../frames/morphing_frame_renderer"
import { PageRenderer } from "./page_renderer"
import { dispatch } from "../../util"
import { morphElements } from "../morphing"

export class MorphingPageRenderer extends PageRenderer {
  static renderElement(currentElement, newElement) {
    morphElements(currentElement, newElement, {
      callbacks: {
        beforeNodeMorphed: element => !canRefreshFrame(element)
      }
    })

    for (const frame of currentElement.querySelectorAll("turbo-frame")) {
      if (canRefreshFrame(frame)) frame.reload()
    }

    dispatch("turbo:morph", { detail: { currentElement, newElement } })
  }

  async preservingPermanentElements(callback) {
    return await callback()
  }

  get renderMethod() {
    return "morph"
  }

  get shouldAutofocus() {
    return false
  }
}

function canRefreshFrame(frame) {
  return frame instanceof FrameElement &&
    frame.shouldReloadWithMorph &&
    !frame.closest("[data-turbo-permanent]")
}
