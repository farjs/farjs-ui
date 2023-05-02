import React from 'react';
import TestRenderer from 'react-test-renderer';
import Button from './Button.mjs';
import * as UI from './UI.mjs';

import { strict as assert } from 'node:assert';
const { describe, it } = await (async () => { // @ts-ignore
  return process.isBun ? Promise.resolve({describe: (_, fn) => fn(), it: test}) : import('node:test');
})();

const h = React.createElement;

describe('Button.test.mjs', () => {

  it('should call onPress when press button', () => {
    //given
    let isOnPressCalled = false;
    const props = getButtonProps(() => {
      isOnPressCalled = true;
    });
    const result = TestRenderer.create(h(Button, props)).root;
    const button = result.findByType('button')
    
    //when
    button.props.onPress();
    
    //then
    assert.deepEqual(isOnPressCalled, true);
  });

  it('should change focused state when onFocus/onBlur', () => {
    //given
    const props = getButtonProps();
    const renderer = TestRenderer.create(h(Button, props));
    const button = renderer.root.findByType('button')
    assertButton(renderer.root, props, false);

    //when & then
    button.props.onFocus();
    assertButton(renderer.root, props, true);

    //when & then
    button.props.onBlur();
    assertButton(renderer.root, props, false);
  });

  it('should render component', () => {
    //given
    const props = getButtonProps();
    
    //when
    const result = TestRenderer.create(h(Button, props)).root;
    
    //then
    assert.deepEqual(Button.displayName, 'Button');
    assertButton(result, props, false);
  });
});

function getButtonProps(onPress = () => {}) {
  return {
    left: 1,
    top: 2,
    label: "test button",
    style: {
      fg: "white",
      bg: "blue",
      focus: {
        fg: "cyan",
        bg: "black"
      }
    },
    onPress,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {import('./Button').ButtonProps} props
 * @param {boolean} focused
 */
function assertButton(result, props, focused) {
  assert.deepEqual(result.type, Button);
  assert.deepEqual(result.children.length, 1);

  // @ts-ignore
  const button = result.children[0].props;
  assert.deepEqual(button.mouse, true);
  assert.deepEqual(button.tags, true);
  assert.deepEqual(button.wrap, false);
  assert.deepEqual(button.width, props.label.length);
  assert.deepEqual(button.height, 1);
  assert.deepEqual(button.left, props.left);
  assert.deepEqual(button.top, props.top);

  const style = focused ? props.style.focus : props.style;
  assert.deepEqual(button.content, UI.renderText2(style, props.label));
}
