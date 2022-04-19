import { IEmailBlock } from '@novu/shared';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useMantineTheme } from '@mantine/core';
import { colors } from '../../../design-system';
import { EnvContext } from '../../../store/environmentContext';

export function TextRowContent({ block, onTextChange }: { block: IEmailBlock; onTextChange: (text: string) => void }) {
  const theme = useMantineTheme();
  const { readonly } = useContext(EnvContext);
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>(block.content);
  const [visiblePlaceholder, setVisiblePlaceholder] = useState(!!block.content);

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  function handleTextChange(data) {
    onTextChange(data);
    let showPlaceHolder = !data;

    if (data === '<br>') showPlaceHolder = true;

    setVisiblePlaceholder(showPlaceHolder);
  }

  useEffect(() => {
    if (block.content !== ref.current?.innerHTML) {
      setText(block.content);
    }
  }, [block.content]);

  useEffect(() => {
    let showPlaceHolder = !block.content;

    if (block.content === '<br>') showPlaceHolder = true;

    setVisiblePlaceholder(showPlaceHolder);
  }, [block.content, text]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={ref}
        data-test-id="editable-text-content"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
        contentEditable={!readonly}
        suppressContentEditableWarning
        onKeyUp={(e: any) => handleTextChange(e.target.innerHTML)}
        style={{
          display: 'inline-block',
          width: '90%',
          outline: 'none',
          backgroundColor: 'transparent',
          direction: block.styles?.textDirection || 'ltr',
        }}
      />

      <PlaceHolder color={theme.colorScheme === 'dark' ? colors.B40 : colors.B70} show={visiblePlaceholder}>
        Type the email content here...
      </PlaceHolder>
    </div>
  );
}

const PlaceHolder = styled.div<{ show: boolean; color: string }>`
  position: absolute;
  color: ${({ color }) => color};
  z-index: 1;
  top: 0px;
  pointer-events: none;
  display: ${({ show }) => (show ? 'block' : 'none')};
`;
