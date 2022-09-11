const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("generate")
    .setNameLocalizations({
      "fi": 'tuota',
      "en-US": 'generate',
      "de": 'generieren',
      "fr": 'générer',
      "it": 'generare',
      "ja": '生成する',
      "ko": '생성',
      "nl": 'genereren',
      "pl": 'generować',
      "pt-BR": 'gerar'
    })
    .setDescription("Generate Text Using OpenAI")
    .setDescriptionLocalizations({
      "fi": 'Tuota tekstiä käyttäen OpenAI:ta',
      "en-US": 'Generate Text Using OpenAI',
      "de": 'Generiere Text mit OpenAI',
      "fr": 'Générer du texte en utilisant OpenAI',
      "it": 'Genera testo utilizzando OpenAI',
      "ja": 'OpenAIを使用してテキストを生成する',
      "ko": 'OpenAI를 사용하여 텍스트 생성',
      "nl": 'Genereer tekst met OpenAI',
      "pl": 'Generuj tekst za pomocą OpenAI',
      "pt-BR": 'Gerar texto usando OpenAI'
    })
    .addStringOption((option) =>
      option
        .setName('subject')
        .setNameLocalizations({
          "fi": 'aihe',
          "en-US": 'subject',
          "de": 'thema',
          "fr": 'sujet',
          "it": 'soggetto',
          "ja": 'テーマ',
          "ko": '제목',
          "nl": 'onderwerp',
          "pl": 'temat',
          "pt-BR": 'tema'
        })
        .setDescription('Subject of the text')
        .setDescriptionLocalizations({
          "fi": 'Tekstin aihe',
          "en-US": 'Subject of the text',
          "de": 'Thema des Textes',
          "fr": 'Sujet du texte',
          "it": 'Argomento del testo',
          "ja": 'テキストの主題',
          "ko": '텍스트의 주제',
          "nl": 'Onderwerp van de tekst',
          "pl": 'Temat tekstu',
          "pt-BR": 'Tema do texto'
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('model')
        .setNameLocalizations({
          "fi": 'malli',
          "en-US": 'model',
          "de": 'modell',
          "fr": 'modèle',
          "it": 'modello',
          "ja": 'モデル',
          "ko": '모델',
          "nl": 'model',
          "pl": 'model',
          "pt-BR": 'modelo'
        })
        .setDescription('Text Generation Model')
        .setDescriptionLocalizations({
          "fi": 'Tekstin generointimalli',
          "en-US": 'Text Generation Model',
          "de": 'Textgenerierungsmodell',
          "fr": 'Modèle de génération de texte',
          "it": 'Modello di generazione di testo',
          "ja": 'テキスト生成モデル',
          "ko": '텍스트 생성 모델',
          "nl": 'Tekstgeneratiemodel',
          "pl": 'Model generowania tekstu',
          "pt-BR": 'Modelo de geração de texto'
        })
        .setRequired(false)
        .addChoices(
          { name: 'text-davinci-002', value: 'text_davinci_002' },
          { name: 'text-curie-001', value: 'text_curie_001' },
          { name: 'text-babbage-001', value: 'text_babbage_001' },
          { name: 'text-ada-001', value: 'text_ada_001' },
          { name: 'text-davinci-001', value: 'text_davinci_001' },
        )
    ),
  async execute(interaction) {


    const GenText = {
      fi: 'Generoidaan tekstiä...',
      en: 'Generating Text...',
      de: 'Generiere Text...',
      fr: 'Génération de texte...',
      it: 'Generazione del testo...',
      ja: 'テキストを生成しています...',
      ko: '텍스트 생성 중...',
      nl: 'Tekst genereren...',
      pl: 'Generowanie tekstu...',
      pt: 'Gerando texto...'
    };

    const subject = interaction.options.getString('subject');
    const model = interaction.options.getString('model') || 'text-davinci-002';

    const LoadingEmbed = new EmbedBuilder()
      .setAuthor({ name: GenText[interaction.locale] ?? "Generating Text..." })
      .setImage("https://openai.com/content/images/2022/05/twitter-1.png")
      .setColor(Colors.Yellow)
      .setTimestamp()
      .setFooter({ text: "Powered By OpenAI" })

    await interaction.editReply({
      embeds: [LoadingEmbed],
      ephemeral: true
    })


    const response = await openai.createCompletion({
      model: model, // text_davinci_002 is the default model
      prompt: subject, // The prompt is the text that the AI will use to generate the text
      temperature: 0.5,
      max_tokens: 100, // Length of the text
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      best_of: 3, // How many servers will be used to generate the text
    });


    if (response.status === 200) {

      const SuccessMsg = {
        fi: 'Teksti generoitu onnistuneesti!',
        en: 'Text Generated Successfully!',
        de: 'Text erfolgreich generiert!',
        fr: 'Texte généré avec succès!',
        it: 'Testo generato con successo!',
        ja: 'テキストが正常に生成されました！',
        ko: '텍스트가 성공적으로 생성되었습니다!',
        nl: 'Tekst succesvol gegenereerd!',
        pl: 'Tekst został pomyślnie wygenerowany!',
        pt: 'Texto gerado com sucesso!'
      };


      const SuccessEmbed = new EmbedBuilder()
        .setAuthor({ name: SuccessMsg[interaction.locale] ?? "Text Generated Successfully!" })
        .setDescription(response.data.choices[0].text)
        .setColor(Colors.Yellow)
        .setTimestamp()
        .setFooter({ text: "Powered By OpenAI" })

      await interaction.editReply({
        embeds: [SuccessEmbed],
        ephemeral: true
      });
    } else {

      const FailMsg = {
        fi: 'Tekstin generointi epäonnistui',
        en: 'Text Generation Failed',
        de: 'Textgenerierung fehlgeschlagen',
        fr: 'La génération de texte a échoué',
        it: 'Generazione del testo non riuscita',
        ja: 'テキストの生成に失敗しました',
        ko: '텍스트 생성 실패',
        nl: 'Tekstgeneratie mislukt',
        pl: 'Generowanie tekstu nie powiodło się',
        pt: 'Falha na geração de texto'
      };


      const FailEmbed = new EmbedBuilder()
        .setAuthor({ name: FailMsg[interaction.locale] ?? "Text Generation Failed" })
        .setDescription(`Failed for ${response.statusText ?? "Unknown Reason"}`)
        .setImage("https://149695847.v2.pressablecdn.com/wp-content/uploads/2021/11/openai-logo-horizontal-gradient.jpg")
        .setColor(Colors.Red)
        .setTimestamp()
        .setFooter({ text: "Powered By OpenAI" })

      await interaction.editReply({
        embeds: [FailEmbed],
        ephemeral: true
      })
    }

  },
};
