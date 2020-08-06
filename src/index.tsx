import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  NativeModules,
  TextInputProps,
} from 'react-native';
import { styles } from './styles';

import makeVisibleWhite from './assets/make_visible_white.png';
import makeInvisibleWhite from './assets/make_invisible_white.png';
import makeVisibleBlack from './assets/make_visible_black.png';
import makeInvisibleBlack from './assets/make_invisible_black.png';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

interface Props extends TextInputProps {
  /**Style to the container of whole component*/
  containerStyles?: Object;
  /**Changes the color for hide/show password image*/
  darkTheme?: true | false | undefined;
  /**Value for the label, same as placeholder */
  label: string;
  /**Style to the label */
  labelStyles?: Object;
  /**Set this to true if is password to have a show/hide input and secureTextEntry automatically*/
  isPassword?: true | false | undefined;
  /**Callback for action submit on the keyboard */
  onSubmit?: Function;
  /**Style to the show/hide password container */
  showPasswordContainerStyles?: Object;
  /**Style to the show/hide password image */
  showPasswordImageStyles?: Object;
  /**Style to the input */
  inputStyles?: Object;
  /**Path to your custom image for show/hide input */
  customShowPasswordImage?: string;
  /**Custom Style for position, size and color for label, when it's focused or blurred*/
  customLabelStyles?: {
    leftFocused: 15;
    leftBlurred: 30;
    topFocused: 0;
    topBlurred: 10;
    fontSizeFocused: 10;
    fontSizeBlurred: 14;
    colorFocused: '#49658c';
    colorBlurred: '#49658c';
  };
  /**Required if onFocus or onBlur is overrided*/
  isFocused: boolean;
  isShowPassword: boolean;
  /**Ref to FloatingLabelInput*/
}

interface InputRef {
  focus(): void;
}

const FloatingLabelInput: React.RefForwardingComponent<InputRef, Props> = (
  props,
  ref,
) => {
  const [isFocused, setIsFocused] = useState(props.value !== '' ? true : false);
  const [secureText, setSecureText] = useState(true);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    LayoutAnimation.spring();
    setIsFocused(props.isFocused);
  }, [props.isFocused]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));

  function handleFocus() {
    LayoutAnimation.spring();
    setIsFocused(true);
  }

  function handleBlur() {
    if (props.value === '' || props.value == null) {
      LayoutAnimation.spring();
      setIsFocused(false);
    }
  }

  function setFocus() {
    inputRef.current?.focus();
  }

  function _toggleVisibility() {
    if (secureText) {
      setSecureText(false);
    } else {
      setSecureText(true);
    }
  }

  function onSubmitEditing() {
    if (props.onSubmit !== undefined) {
      props.onSubmit();
    }
  }

  let imgSource = props.darkTheme
    ? secureText
      ? makeVisibleBlack
      : makeInvisibleBlack
    : secureText
    ? makeVisibleWhite
    : makeInvisibleWhite;

  const customLabelStyles = {
    leftFocused: 15,
    leftBlurred: 30,
    topFocused: 0,
    topBlurred: 12.5,
    fontSizeFocused: 10,
    fontSizeBlurred: 14,
    colorFocused: '#49658c',
    colorBlurred: '#49658c',
    ...props.customLabelStyles,
  };

  const style: Object = {
    zIndex: 3,
    position: 'absolute',
    left: !isFocused
      ? customLabelStyles.leftBlurred
      : customLabelStyles.leftFocused,
    top: !isFocused
      ? customLabelStyles.topBlurred
      : customLabelStyles.topFocused,
    fontSize: !isFocused
      ? customLabelStyles.fontSizeBlurred
      : customLabelStyles.fontSizeFocused,
    color: !isFocused
      ? customLabelStyles.colorBlurred
      : customLabelStyles.colorFocused,
    ...props.labelStyles,
  };

  const input: Object = {
    color: customLabelStyles.colorFocused,
    ...styles.input,
    ...props.inputStyles,
  };

  const containerStyles: Object = {
    height: 50,
    color: '#49658c',
    borderColor: '#49658c',
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: '#00000000',
    paddingTop: 10,
    paddingBottom: 10,
    alignContent: 'center',
    justifyContent: 'center',
    ...props.containerStyles,
  };

  const toggleButton = {
    ...styles.toggleButton,
    ...props.showPasswordContainerStyles,
  };

  const img = {
    ...styles.img,
    ...props.showPasswordImageStyles,
  };

  return (
    <View style={containerStyles}>
      <Text onPress={setFocus} style={style}>
        {props.label}
      </Text>
      <View style={styles.containerInput}>
        <TextInput
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={
            props.isPassword !== undefined
              ? props.isPassword && secureText
              : false
          }
          style={input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={inputRef}
          {...props}
          placeholder=""
        />
        {props.isPassword && props.isShowPassword && (
          <TouchableOpacity style={toggleButton} onPress={_toggleVisibility}>
            <Image
              source={
                props.customShowPasswordImage !== undefined
                  ? props.customShowPasswordImage
                  : imgSource
              }
              resizeMode="contain"
              style={img}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default forwardRef(FloatingLabelInput);
