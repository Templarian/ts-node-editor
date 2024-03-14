import { selectComponent, getProps } from '@pictogrammers/element';

import './menu';
import UiMenu from './menu';
import UiMenuItem from './../menuItem/menuItem';

const UI_MENU = 'ui-menu';

describe('ui-menu', () => {

  beforeEach(() => {
    var c = document.createElement(UI_MENU);
    document.body.appendChild(c);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('should be registered', () => {
    expect(customElements.get(UI_MENU)).toBeDefined();
  });

  it('should only expose known props', () => {
    const props = getProps(UI_MENU);
    expect(props.length).toBe(1);
    expect(props).toContain('options');
  });

  it('should render 0 items', () => {
    const component = selectComponent<UiMenu>(UI_MENU);
    const { $items } = component;
    expect($items.children.length).toEqual(0);
  });

  it('should add and remove items', () => {
    const component = selectComponent<UiMenu>(UI_MENU);
    const { $items } = component;
    component.options.push({
      type: UiMenuItem,
      key: '0',
      label: 'Item 1'
    });
    component.options.push({
      type: UiMenuItem,
      key: '1',
      label: 'Item 2'
    });
    component.options.push({
      type: UiMenuItem,
      key: '2',
      label: 'Item 3'
    });
    expect($items.children.length).toEqual(3);
    component.options.shift();
    expect($items.children.length).toEqual(2);
    const item1 = $items.children[0] as UiMenuItem;
    const item2 = $items.children[1] as UiMenuItem;
    expect(item1.label).toEqual('Item 2');
    expect(item2.label).toEqual('Item 3');
    component.options.pop();
    expect($items.children.length).toEqual(1);
    const item3 = $items.children[0] as UiMenuItem;
    expect(item3.label).toEqual('Item 2');
    component.options.unshift({
      type: UiMenuItem,
      key: '4',
      label: 'New Item'
    });
    expect($items.children.length).toEqual(2);
    const item4 = $items.children[0] as UiMenuItem;
    expect(item4.label).toEqual('New Item');
    component.options.push({
      type: UiMenuItem,
      key: '5',
      label: 'New Item 2'
    });
    expect($items.children.length).toEqual(3);
    const item5 = $items.children[2] as UiMenuItem;
    expect(item5.label).toEqual('New Item 2');
  });

});
