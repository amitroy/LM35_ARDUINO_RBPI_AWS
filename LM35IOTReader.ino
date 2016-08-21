int val;
int tempPin = 1;

void setup()
{
  Serial.begin(115200);
}
void loop()
{
  if (Serial.available())
  {
    char serialInput = Serial.read();
    switch (serialInput)
    {
      case 'A':
        {    
          val = analogRead(tempPin);
          float mv = ( val/1024.0)*5000;
          float cel = mv/10;
          float farh = (cel*9)/5 + 32;
          //JSON Message
          Serial.print("{");
          Serial.print("\"read\":");
          Serial.print("{");
          Serial.print("\"celsius\":");Serial.print(cel);
          Serial.print(",");
          Serial.print("\"fahrenheit\":"); Serial.print(farh);
          Serial.print("}");
          Serial.print("}");
          Serial.print("\n");
        }
        break;   
      default:
          Serial.print("{");
          Serial.print("\"read\":");
          Serial.print("{");
          Serial.print("\"error\":");Serial.print("\"Unknown parameter\"");
          Serial.print("}");
          Serial.print("}");
          Serial.print("\n");
        break;
    }
  }
}
