import {
  Component,
  Prop,
  Part,
  normalizeInt,
  normalizeString
} from '@pictogrammers/element';

import template from "./nodeEntry.html";
import style from './nodeEntry.css';

import { wireContextMenu, unwireContextMenu } from './../../utils/contextMenu';
import UiNodeBase from '../nodeBase/nodeBase';
import UiIcon from '../icon/icon';
import UiMenuItem from '../menuItem/menuItem';

@Component({
  selector: 'ui-node-entry',
  style,
  template
})
export default class UiNodeEntry extends UiNodeBase {
  @Prop(normalizeString) icon = 'application';

  @Part() $icon: UiIcon;

  connectedCallback() {
    wireContextMenu(this, () => {
      return [{
        type: UiMenuItem,
        label: 'Script',
        key: 'script'
      }];
    })
  }

  render(changes) {
    if (changes.icon) {
      this.$icon.name = this.icon;
    }
  }
}
