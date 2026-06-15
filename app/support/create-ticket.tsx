import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { Screen } from '@/components/screen';
import { ScreenHeader } from '@/components/screen-header';
import { sharedStyles } from '@/components/shared-styles';
import { supportService } from '@/services/support.service';

export default function CreateTicketScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const createTicket = async () => {
    setError('');
    if (!subject.trim() || !message.trim()) {
      setError('Completa el asunto y el mensaje.');
      return;
    }

    const ticket = await supportService.createTicket({ subject, message });
    router.replace({ pathname: '/support/[id]', params: { id: ticket.id } });
  };

  return (
    <Screen>
      <ScreenHeader title="Nuevo ticket" subtitle="Describe el problema para que soporte pueda ayudarte." />
      <AppTextField label="Asunto" onChangeText={setSubject} value={subject} />
      <AppTextField label="Mensaje" multiline onChangeText={setMessage} value={message} />
      {error ? <Text style={sharedStyles.errorText}>{error}</Text> : null}
      <AppButton title="Enviar ticket" icon="plus-circle-outline" onPress={createTicket} />
    </Screen>
  );
}
