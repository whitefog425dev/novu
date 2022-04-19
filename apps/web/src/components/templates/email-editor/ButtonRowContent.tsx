import { IEmailBlock } from '@novu/shared';
import { useContext, useEffect, useState } from 'react';
import { TextInput as MantineInput, Popover, Button as MantineButton } from '@mantine/core';
import { colors, shadows } from '../../../design-system';
import { TextAlignment, Wifi } from '../../../design-system/icons';
import { EnvContext } from '../../../store/environmentContext';

export function ButtonRowContent({
  block,
  onTextChange,
  onUrlChange,
  brandingColor,
}: {
  block: IEmailBlock;
  onTextChange: (text: string) => void;
  onUrlChange: (url: string) => void;
  brandingColor: string | undefined;
}) {
  const { readonly } = useContext(EnvContext);
  const [url, setUrl] = useState<string>();
  const [text, setText] = useState<string>();
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);

  function handleTextChange(e) {
    setText(e.target.value);
    onTextChange(e.target.value);
  }

  function handleUrlChange(e) {
    setUrl(e.target.value);
    onUrlChange(e.target.value);
  }

  useEffect(() => {
    setText(block.content);
  }, [block.content]);

  useEffect(() => {
    setUrl(block.url);
  }, [block.url]);

  return (
    <div
      style={{ textAlign: 'center', direction: block?.styles?.textDirection || 'ltr' }}
      data-test-id="button-block-wrapper"
    >
      <Popover
        styles={(theme) => ({
          inner: {
            padding: '5px',
          },
          arrow: {
            width: '7px',
            height: '7px',
            backgroundColor: theme.colorScheme === 'dark' ? colors.B20 : colors.white,
            border: 'none',
          },
          body: {
            minWidth: 220,
            backgroundColor: theme.colorScheme === 'dark' ? colors.B20 : colors.white,
            color: theme.colorScheme === 'dark' ? theme.white : colors.B40,
            border: 'none',
            boxShadow: theme.colorScheme === 'dark' ? shadows.dark : shadows.medium,
          },
        })}
        opened={dropDownVisible && !readonly}
        withArrow
        onClose={() => setDropDownVisible(false)}
        target={
          <MantineButton
            sx={{
              backgroundColor: brandingColor || 'red',
              '&:hover': {
                backgroundColor: brandingColor || 'red',
              },
            }}
            color="red"
            onClick={() => setDropDownVisible((open) => !open)}
          >
            {block.content}
          </MantineButton>
        }
      >
        <MantineInput
          data-test-id="button-text-input"
          icon={<TextAlignment />}
          variant="unstyled"
          onChange={handleTextChange}
          value={text}
          placeholder="Button Text"
        />
        <MantineInput
          icon={<Wifi width={20} height={20} />}
          variant="unstyled"
          onChange={handleUrlChange}
          value={url || ''}
          placeholder="Button Link"
        />
      </Popover>
    </div>
  );
}
