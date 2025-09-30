## Directory Description

- The `common/assets/icons/preserve-color` directory stores colored SVG icons.

- SVG icons stored in the `common/assets/icons` directory will have their `fill` and `stroke` attributes overwritten by a plugin, causing the original colors to be lost and instead inherit the color of the parent element.

## Usage

When using icons from the `common/assets/icons/preserve-color` directory, add the `preserve-color/` prefix, like this: `<SvgIcon name="preserve-color/name" />`

For icons from the `common/assets/icons` directory, no prefix is needed, like this: `<SvgIcon name="name" />`
