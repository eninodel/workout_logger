import React, { useState, useEffect } from 'react';
import { Modal, Button, Checkbox, HStack, Text } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InstructionsModal({
  children,
  setShow,
  show,
}: {
  children: JSX.Element;
  setShow: Function;
  show: boolean;
}) {
  const [checkboxValue, setCheckboxValue] = useState<boolean>(false);

  useEffect(() => {
    showModal();
  });

  const showModal = async () => {
    try {
      const value = await AsyncStorage.getItem('SHOW_MODAL');
      if (value !== null) {
        // Something here so don't show modal
        setShow(false);
        return false;
      } else {
        // Nothing here, show modal
        return true;
      }
    } catch (e) {}
  };

  const onHide = (showAgain: boolean) => {
    setShow(false);
    if (showAgain) {
      AsyncStorage.setItem('SHOW_MODAL', 'FALSE');
    }
  };

  return (
    <>
      <Modal
        isOpen={show}
        onClose={() => {
          onHide(checkboxValue);
        }}
      >
        <Modal.Content>
          <Modal.CloseButton></Modal.CloseButton>
          <Modal.Header>Instructions</Modal.Header>
          <Modal.Body>
            Hello and thank you for downloading! This app was created to quickly and easily help beginners and advanced
            athletes log and keep track of their workouts.
            {''}
            <Text fontSize={'md'} bold>
              Adding a new workout
            </Text>
            To start, click on the bottom '+' button to add a new workout. Be sure to add in a title and the target reps
            or minutes for each exercise. Additionaly, you can also add a link to an online photo, video, or website to
            demonstrate the workout. Finally, you can add a note to each workout (great for remembering where certain
            equipment is located at the gym).
            {''}
            <Text fontSize={'md'} bold>
              Logging and recording a workout
            </Text>
            To log and record a workout simply tap on a workout and type the weight lifted/minutes completed.
            {''}
            <Text fontSize={'md'} bold>
              Editing and deleting a workout
            </Text>
            Don't like a workout anymore or want to make it better? Long press a workout and select the option you want
            to choose. It's that simple!
          </Modal.Body>
          <Modal.Footer>
            <HStack width={'full'} justifyContent={'space-between'}>
              <Checkbox
                size={'sm'}
                defaultIsChecked={false}
                value="NO_SHOW"
                onChange={isSelected => setCheckboxValue(isSelected)}
              >
                Don't show this again
              </Checkbox>
              <Button
                onPress={() => {
                  onHide(checkboxValue);
                }}
              >
                Close
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {children}
    </>
  );
}
