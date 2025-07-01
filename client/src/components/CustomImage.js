import { mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';

const CustomImage = Image.extend({
  name: 'customImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: (el) => el.getAttribute('width'),
        renderHTML: (attrs) => ({ width: attrs.width }),
      },
      height: {
        default: null,
        parseHTML: (el) => el.getAttribute('height'),
        renderHTML: (attrs) => attrs.height ? { height: attrs.height } : {},
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
});

export default CustomImage;
