import {
  Component,
  Prop,
  Part,
  normalizeInt,
  normalizeString
} from '@pictogrammers/element';

import template from "./nodeImport.html";
import style from './nodeImport.css';

import UiNodeBase from '../nodeBase/nodeBase';

@Component({
  selector: 'ui-node-import',
  style,
  template
})
export default class UiNodeImport extends UiNodeBase {
  @Prop(normalizeString) src = '';
  @Prop() path: string[] = [];

  render(changes) {
    
  }
}
