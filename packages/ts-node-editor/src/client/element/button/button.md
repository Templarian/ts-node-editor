# ui-button

A basic button container.

## Example

```typescript
import '@pictogrammers/element/button';
import UiButton from '@pictogrammers/element/button';
```

```html
<ui-button tooltip="Hello World!">
    <ui-icon name="icon" size="16" slot="start">
    Hello World
</ui-button>
```

## Props

| Name | Description |
| ---- | ----------- |
| `tooltip` | Tooltip Text |

## Slots

| Name    | Description |
| ------- | ----------- |
|         | Center content |
| `start` | Left content |
| `end`   | Right content |