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
import UiMenu from '../menu/menu';
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
    wireContextMenu(
      this,
      {
        open($menu: UiMenu, x: number, y: number) {
          $menu.options = [{
            type: UiMenuItem,
            label: 'Application',
            icon: 'application',
            key: 'application'
          }, {
            type: UiMenuItem,
            label: 'Script',
            icon: 'script',
            key: 'script'
          }, {
            type: UiMenuItem,
            label: 'Potion',
            icon: 'potion',
            key: 'potion'
          }];
        },
        select: (item: any) => {
          this.$icon.name = item.key;
        }
      }
    );
  }

  handleContextMenu(item: any) {

  }

  render(changes) {
    if (changes.icon) {
      this.$icon.name = this.icon;
    }
  }
}
