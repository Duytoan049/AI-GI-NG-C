/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CurriculumLesson {
  id: string;
  title: string;
  gradeLevel: 'tieu-hoc' | 'thcs' | 'thpt';
  gradeNumber: number; // 1 to 12
  subject: 'tieng-viet' | 'tieng-anh';
  authorOrSource: string;
  category: string; // Tập đọc, Thơ, Văn bản thông tin, Hội thoại, v.v.
  speedRecommended: number;
  description: string;
  content: string;
  vocabulary: Array<{
    word: string;
    ipaOrTone: string;
    meaning: string;
  }>;
  readingTips: string;
}

export const CURRICULUM_LESSONS: CurriculumLesson[] = [
  // ==========================================
  // TIỂU HỌC (LỚP 1 - 5) - TIẾNG VIỆT
  // ==========================================
  {
    id: 'tv-th-1-di-hoc',
    title: 'Đi học (Trích thơ)',
    gradeLevel: 'tieu-hoc',
    gradeNumber: 1,
    subject: 'tieng-viet',
    authorOrSource: 'Hoàng Minh Chính - SGK Tiếng Việt 1',
    category: 'Thơ thiếu nhi',
    speedRecommended: 0.75,
    description: 'Bài thơ quen thuộc giúp học sinh lớp 1 luyện ngắt nhịp và phát âm trong trẻo, nhẹ nhàng.',
    content: `Hôm qua em tới trường
Mẹ dắt tay từng bước
Hôm nay mẹ lên nương
Một mình em tới lớp.

Đường xa quá là xa
Bao nhiêu là khe suối
Hương rừng thơm đồi vắng
Nước suối trong thầm thì.

Cọ xòe ô che nắng
Râm mát đường em đi.`,
    vocabulary: [
      { word: 'tới trường', ipaOrTone: 'Thanh sắc - huyền', meaning: 'Đi đến trường học' },
      { word: 'lên nương', ipaOrTone: 'Thanh ngang - ngang', meaning: 'Đi làm rẫy, trồng trọt trên đồi' },
      { word: 'khe suối', ipaOrTone: 'Thanh ngang - sắc', meaning: 'Dòng nước nhỏ chảy qua khe núi đá' },
      { word: 'thầm thì', ipaOrTone: 'Thanh huyền - huyền', meaning: 'Tiếng nước chảy róc rách êm dịu' }
    ],
    readingTips: 'Đọc với giọng vui tươi, trong sáng. Ngắt hơi sau mỗi dòng thơ và nghỉ hơi lâu hơn một chút sau mỗi khổ thơ.'
  },
  {
    id: 'tv-th-2-co-giao',
    title: 'Cô giáo lớp em',
    gradeLevel: 'tieu-hoc',
    gradeNumber: 2,
    subject: 'tieng-viet',
    authorOrSource: 'Nguyễn Xuân Sanh - SGK Tiếng Việt 2',
    category: 'Tập đọc - Thơ',
    speedRecommended: 0.8,
    description: 'Bài đọc bồi dưỡng tình cảm kính yêu thầy cô giáo, rèn luyện phát âm rõ các vần êm, cười, trang.',
    content: `Sáng nào em đến lớp
Cũng thấy cô đến rồi
Đáp lời: "Chào cô ạ!"
Cô mỉm cười thật tươi.

Cô dạy em tập viết
Gió đưa thoảng hương nhài
Nắng ghé vào cửa lớp
Xem chúng em học bài.

Những lời cô giáo giảng
Ấm trang vở thơm tho
Yêu thương em ngắm mãi
Những điểm mười cô cho.`,
    vocabulary: [
      { word: 'mỉm cười', ipaOrTone: 'Thanh hỏi - huyền', meaning: 'Cười nhẹ, hé môi biểu lộ niềm vui' },
      { word: 'hương nhài', ipaOrTone: 'Thanh ngang - huyền', meaning: 'Mùi thơm dịu mát của hoa lài' },
      { word: 'thơm tho', ipaOrTone: 'Thanh ngang - ngang', meaning: 'Mùi giấy mới thơm dễ chịu' }
    ],
    readingTips: 'Đọc diễn cảm dịu dàng, trìu mến. Chú ý ngắt giọng ở câu chào cô và nhấn giọng ở cụm từ "điểm mười cô cho".'
  },
  {
    id: 'tv-th-3-hat-gao',
    title: 'Hạt gạo làng ta',
    gradeLevel: 'tieu-hoc',
    gradeNumber: 3,
    subject: 'tieng-viet',
    authorOrSource: 'Trần Đăng Khoa - SGK Tiếng Việt 3',
    category: 'Tập đọc - Thơ',
    speedRecommended: 0.8,
    description: 'Giúp học sinh cảm nhận nỗi vất vả của người nông dân để làm ra hạt gạo trắng thơm.',
    content: `Hạt gạo làng ta
Có vị phù sa
Của sông Kinh Thầy
Có hương sen thơm
Trong hồ nước đầy
Có lời mẹ hát
Ngọt bùi đắng cay...

Hạt gạo làng ta
Có bão tháng bảy
Có mưa tháng ba
Giọt mồ hôi sa
Những trưa tháng sáu
Nước như ai nấu
Chết cả cá cờ
Cua ngoi lên bờ
Mẹ em xuống cấy...`,
    vocabulary: [
      { word: 'phù sa', ipaOrTone: 'Thanh huyền - ngang', meaning: 'Đất cát mịn màu mỡ do dòng sông bồi đắp' },
      { word: 'ngọt bùi', ipaOrTone: 'Thanh nặng - huyền', meaning: 'Hương vị thơm ngon, nghĩa bóng là niềm vui sướng' },
      { word: 'mồ hôi sa', ipaOrTone: 'Thanh huyền - ngang - ngang', meaning: 'Mồ hôi rơi nhiều vì vất vả, trời nắng gắt' }
    ],
    readingTips: 'Khổ 1 đọc với giọng thiết tha, tự hào. Khổ 2 đọc chậm lại, sâu lắng thể hiện sự gian nan của mẹ giữa trưa hè.'
  },
  {
    id: 'tv-th-4-de-men',
    title: 'Dế Mèn bênh vực kẻ yếu',
    gradeLevel: 'tieu-hoc',
    gradeNumber: 4,
    subject: 'tieng-viet',
    authorOrSource: 'Tô Hoài - SGK Tiếng Việt 4',
    category: 'Văn xuôi truyện',
    speedRecommended: 0.85,
    description: 'Đoạn trích kinh điển dạy lòng hiệp nghĩa, dũng cảm giúp đỡ người yếu thế.',
    content: `Một hôm, qua một vùng cỏ xước xanh dài, tôi chợt nghe tiếng khóc tỉ tê. Đi vài bước nữa, tôi gặp chị Nhà Trò ngồi gục đầu bên tảng đá cuội.

Chị Nhà Trò đã nhỏ bé lại gầy yếu quá, người bợt bạt như mới lột. Chị mặc áo thâm dài, đôi cánh mỏng như cánh bướm non, lại ngắn chùn chùn. Hình như cánh yếu quá, chưa quen mở, mà cho dù có khỏe cũng chẳng bay được xa.

Tôi đến gần, chị Nhà Trò khóc kể:
- Năm trước, gặp khi trời làm đói kém, mẹ em phải vay lương ăn của bọn nhện. Sau đấy, không may mẹ em mất đi, còn lại thui thủi có mình em. Nay bọn nhện chăng tơ chặn đường, đe bắt em vặt chân, vặt cánh ăn thịt!

Tôi xòe cả hai càng ra, bảo Nhà Trò:
- Em đừng sợ. Hãy trở về cùng với tôi. Đứa độc ác không thể cậy khỏe bắt nạt kẻ yếu được.`,
    vocabulary: [
      { word: 'bợt bạt', ipaOrTone: 'Thanh nặng - nặng', meaning: 'Màu da nhợt nhạt, yếu ớt' },
      { word: 'thui thủi', ipaOrTone: 'Thanh ngang - hỏi', meaning: 'Cô đơn một mình, không nơi nương tựa' },
      { word: 'bênh vực', ipaOrTone: 'Thanh ngang - nặng', meaning: 'Đứng về phía người yếu để che chở, bảo vệ' }
    ],
    readingTips: 'Phân biệt giọng kể của Dế Mèn (mạnh mẽ, dứt khoát), giọng chị Nhà Trò (yếu ớt, nức nở) và lời hứa nghĩa hiệp của Dế Mèn (hào sảng, đanh thép).'
  },

  // ==========================================
  // TIỂU HỌC (LỚP 1 - 5) - TIẾNG ANH
  // ==========================================
  {
    id: 'en-th-1-greetings',
    title: 'Hello! Welcome to School',
    gradeLevel: 'tieu-hoc',
    gradeNumber: 1,
    subject: 'tieng-anh',
    authorOrSource: 'Tiếng Anh 1 - Global Success / GDPT 2018',
    category: 'Phonics & Greetings',
    speedRecommended: 0.7,
    description: 'Bài luyện phát âm chào hỏi cơ bản, làm quen với âm đuôi /s/, /m/, /t/.',
    content: `Hello! My name is Nam.
I am six years old.
This is my cat, Mimi.
Mimi is small and white.

Good morning, teacher!
Good morning, friends!
I love my school.
Let's learn and play together!`,
    vocabulary: [
      { word: 'Hello', ipaOrTone: '/həˈləʊ/', meaning: 'Xin chào' },
      { word: 'Name', ipaOrTone: '/neɪm/', meaning: 'Tên' },
      { word: 'School', ipaOrTone: '/skuːl/', meaning: 'Trường học' },
      { word: 'Together', ipaOrTone: '/təˈɡeðər/', meaning: 'Cùng nhau' }
    ],
    readingTips: 'Pronounce ending consonants clearly (nam/m/, cat/t/, friends/z/). Speak in a cheerful, friendly voice.'
  },
  {
    id: 'en-th-3-family',
    title: 'My Lovely Family',
    gradeLevel: 'tieu-hoc',
    gradeNumber: 3,
    subject: 'tieng-anh',
    authorOrSource: 'Tiếng Anh 3 - Bộ GD&ĐT',
    category: 'Conversation & Family',
    speedRecommended: 0.8,
    description: 'Chủ đề Gia đình gần gũi, luyện ngữ điệu câu hỏi "Who is that?" và miêu tả ngoại hình.',
    content: `Look at this photo! This is my family.
This is my father. He is tall and kind. He is a doctor.
This is my mother. She has long black hair and a sweet smile. She is a teacher.
And this is my little sister, Mai. She is cute and energetic.
We love spending time together on Sundays in the garden.`,
    vocabulary: [
      { word: 'Family', ipaOrTone: '/ˈfæməli/', meaning: 'Gia đình' },
      { word: 'Doctor', ipaOrTone: '/ˈdɒktər/', meaning: 'Bác sĩ' },
      { word: 'Smile', ipaOrTone: '/smaɪl/', meaning: 'Nụ cười' },
      { word: 'Energetic', ipaOrTone: '/ˌenəˈdʒetɪk/', meaning: 'Năng động, tràn đầy năng lượng' }
    ],
    readingTips: 'Pause slightly after commas. Put warm stress on adjectives like "tall", "kind", "sweet", and "cute".'
  },
  {
    id: 'en-th-5-holiday',
    title: 'My Trip to Ha Long Bay',
    gradeLevel: 'tieu-hoc',
    gradeNumber: 5,
    subject: 'tieng-anh',
    authorOrSource: 'Tiếng Anh 5 - Unit 3',
    category: 'Past Tense & Travel',
    speedRecommended: 0.85,
    description: 'Luyện thì quá khứ đơn, miêu tả danh lam thắng cảnh Việt Nam với ngữ điệu tự nhiên.',
    content: `Last summer, my family went to Ha Long Bay by bus.
The trip was fantastic! Ha Long Bay is very famous for its emerald water and thousands of towering limestone islands.
We took a boat cruise around the bay and explored amazing caves.
I took a lot of photos and ate delicious seafood.
It was the best holiday I have ever had!`,
    vocabulary: [
      { word: 'Fantastic', ipaOrTone: '/fænˈtæstɪk/', meaning: 'Tuyệt vời, kỳ diệu' },
      { word: 'Emerald', ipaOrTone: '/ˈemərəld/', meaning: 'Màu xanh ngọc bích' },
      { word: 'Limestone', ipaOrTone: '/ˈlaɪmstəʊn/', meaning: 'Đá vôi' },
      { word: 'Delicious', ipaOrTone: '/dɪˈlɪʃəs/', meaning: 'Thơm ngon' }
    ],
    readingTips: 'Pay attention to regular and irregular past tense forms: went /went/, took /tʊk/, explored /ɪkˈsplɔːd/.'
  },

  // ==========================================
  // THCS (LỚP 6 - 9) - NGỮ VĂN
  // ==========================================
  {
    id: 'tv-thcs-7-cong-truong',
    title: 'Cổng trường mở ra (Trích)',
    gradeLevel: 'thcs',
    gradeNumber: 7,
    subject: 'tieng-viet',
    authorOrSource: 'Lý Lan - SGK Ngữ văn 7',
    category: 'Văn bản nhật dụng / Tản văn',
    speedRecommended: 0.9,
    description: 'Tâm sự của người mẹ đêm trước ngày con vào lớp Một, chan chứa yêu thương và hy vọng.',
    content: `Vào đêm trước ngày khai trường của con, mẹ không ngủ được. Một ngày kia, còn xa lắm, ngày đó con sẽ biết thế nào là không ngủ được. Còn bây giờ giấc ngủ đến với con dễ dàng như uống một ly sữa, ăn một cái kẹo.

Mẹ nhớ sự nôn nao, hồi hộp khi cùng bà ngoại tới gần ngôi trường và cả nỗi chơi vơi hốt hoảng khi cổng trường đóng lại.

Đi đi con, hãy can đảm lên, thế giới này là của con. Bước qua cánh cổng trường là một thế giới kì diệu sẽ mở ra.`,
    vocabulary: [
      { word: 'chơi vơi', ipaOrTone: 'Thanh ngang - ngang', meaning: 'Cảm giác chơ vơ, lạc lõng giữa khoảng không gian rộng' },
      { word: 'kì diệu', ipaOrTone: 'Thanh huyền - nặng', meaning: 'Lạ lùng và vô cùng đẹp đẽ, phi thường' },
      { word: 'can đảm', ipaOrTone: 'Thanh ngang - hỏi', meaning: 'Dũng cảm, không sợ khó khăn nguy hiểm' }
    ],
    readingTips: 'Giọng đọc thủ thỉ, tâm tình, lắng đọng. Câu cuối "Bước qua cánh cổng trường..." cần đọc ấm áp, truyền cảm hứng mạnh mẽ.'
  },
  {
    id: 'tv-thcs-9-dong-chi',
    title: 'Đồng chí (Trích)',
    gradeLevel: 'thcs',
    gradeNumber: 9,
    subject: 'tieng-viet',
    authorOrSource: 'Chính Hữu - SGK Ngữ văn 9',
    category: 'Thơ ca cách mạng',
    speedRecommended: 0.85,
    description: 'Tình đồng chí keo sơn, mộc mạc mà thiêng liêng của những người lính nông dân thời kháng chiến chống Pháp.',
    content: `Quê hương anh nước mặn, đồng chua
Làng tôi nghèo đất cày lên sỏi đá.
Anh với tôi đôi người xa lạ
Tự phương trời chẳng hẹn quen nhau,
Súng bên súng, đầu sát bên đầu,
Đêm rét chung chăn thành đôi tri kỉ.
Đồng chí!

Ruộng nương anh gửi bạn thân cày
Gian nhà không, mặc kệ gió lung lay
Giếng nước gốc đa nhớ người ra lính.
Anh với tôi biết từng cơn ớn lạnh,
Sốt run người vầng trán ướt mồ hôi.

Áo anh rách vai
Quần tôi có vài mảnh vá
Miệng cười buốt giá
Chân không giày
Thương nhau tay nắm lấy bàn tay.

Đêm nay rừng hoang sương muối
Đứng cạnh bên nhau chờ giặc tới
Đầu súng trăng treo.`,
    vocabulary: [
      { word: 'tri kỉ', ipaOrTone: 'Thanh ngang - hỏi', meaning: 'Người bạn hiểu thấu lòng dạ mình' },
      { word: 'sương muối', ipaOrTone: 'Thanh ngang - sắc', meaning: 'Hạt sương đông lạnh buốt trắng như hạt muối' },
      { word: 'Đầu súng trăng treo', ipaOrTone: 'Hình ảnh biểu tượng', meaning: 'Sự kết hợp giữa hiện thực chiến đấu khốc liệt và vẻ đẹp lãng mạn, hòa bình' }
    ],
    readingTips: 'Dòng thơ "Đồng chí!" đứng riêng thành một câu đặc biệt, cần dừng lại một nhịp dài, giọng xúc động nghẹn ngào. Ba câu cuối ngân vang, chắc nịch.'
  },
  {
    id: 'tv-thcs-9-lang-le-sapa',
    title: 'Lặng lẽ Sa Pa (Trích)',
    gradeLevel: 'thcs',
    gradeNumber: 9,
    subject: 'tieng-viet',
    authorOrSource: 'Nguyễn Thành Long - SGK Ngữ văn 9',
    category: 'Truyện ngắn',
    speedRecommended: 0.9,
    description: 'Vẻ đẹp của người thanh niên làm công tác khí tượng một mình trên đỉnh Yên Sơn cao 2600 mét.',
    content: `Hồi chưa vào nghề, những đêm nhắm mắt lại, tôi cứ nghe thấy tiếng gió xao xác ngoài rừng sồi. Mình sinh ra là gì, mình đẻ ở đâu, mình vì ai mà làm việc?

Gian khổ nhất là lần ghi và báo về lúc một giờ sáng. Ở đây có cả mưa tuyết đấy. Nửa đêm đang nằm trong chăn, nghe chuông đồng hồ chỉ muốn trùm chăn ngủ tiếp. Nhưng tôi bật dậy, xách đèn bão ra vườn đo gió, đo mưa. Gió tuyết từng cơn quất vào mặt buốt như kim châm.

Xong việc, trở vào không tài nào ngủ lại được. Nhưng bác ơi, khi ta làm việc, ta với công việc là đôi, sao gọi là một mình được? Huống chi việc của cháu gắn liền với việc của bao anh em, đồng chí dưới kia. Cháu thấy mình hạnh phúc lắm!`,
    vocabulary: [
      { word: 'đèn bão', ipaOrTone: 'Thanh huyền - ngã', meaning: 'Đèn thắp dầu hỏa có khung chắn gió bão không bị tắt' },
      { word: 'khí tượng', ipaOrTone: 'Thanh sắc - nặng', meaning: 'Ngành theo dõi các hiện tượng thời tiết như gió, mưa, mây, nhiệt độ' }
    ],
    readingTips: 'Đọc với ngữ điệu say mê, cởi mở, bộc trực và tràn đầy tinh thần trách nhiệm, lạc quan yêu đời.'
  },

  // ==========================================
  // THCS (LỚP 6 - 9) - TIẾNG ANH
  // ==========================================
  {
    id: 'en-thcs-7-community',
    title: 'Community Service and Giving Back',
    gradeLevel: 'thcs',
    gradeNumber: 7,
    subject: 'tieng-anh',
    authorOrSource: 'Tiếng Anh 7 - Global Success / Unit 3',
    category: 'Community & Society',
    speedRecommended: 0.9,
    description: 'Luyện kỹ năng thuyết trình và đọc hiểu đoạn văn về các hoạt động tình nguyện vì cộng đồng.',
    content: `Community service is work done by a person or group of people that benefits others.
It is often done near the area where you live, so your own community benefits from your work.
You do not get paid to perform community service, but you volunteer your time.

Community service can help many different groups of people: children, senior citizens, and people with disabilities.
Last weekend, our school club collected warm clothes, textbooks, and blankets for children in mountainous areas.
We also planted twenty new trees in the public park.
Doing good things brings genuine joy and strengthens friendship.`,
    vocabulary: [
      { word: 'Community', ipaOrTone: '/kəˈmjuːnəti/', meaning: 'Cộng đồng' },
      { word: 'Volunteer', ipaOrTone: '/ˌvɒlənˈtɪər/', meaning: 'Tình nguyện, người tình nguyện' },
      { word: 'Disability', ipaOrTone: '/ˌdɪsəˈbɪləti/', meaning: 'Khuyết tật' },
      { word: 'Genuine', ipaOrTone: '/ˈdʒenjuɪn/', meaning: 'Chân thật, xuất phát từ đáy lòng' }
    ],
    readingTips: 'Stress key content words (benefits, volunteer, collected, planted, joy). Maintain steady academic cadence.'
  },
  {
    id: 'en-thcs-9-environment',
    title: 'Green Living and Renewable Energy',
    gradeLevel: 'thcs',
    gradeNumber: 9,
    subject: 'tieng-anh',
    authorOrSource: 'Tiếng Anh 9 - Global Success / Unit 10',
    category: 'Science & Ecology',
    speedRecommended: 0.95,
    description: 'Chủ đề môi trường, năng lượng tái tạo, rèn luyện phát âm các thuật ngữ khoa học.',
    content: `As climate change accelerates, transitioning to clean and renewable energy sources has become an urgent global mission.
Fossil fuels such as coal, oil, and natural gas release millions of tons of greenhouse gases into the atmosphere every year.
In contrast, solar power and wind energy are inexhaustible and produce virtually zero carbon emissions during operation.

Individuals can also make significant contributions by adopting green habits.
Simple actions such as reducing single-use plastics, using public transportation, and conserving household electricity collectively generate substantial positive impacts.
Every small action counts towards protecting our planet for future generations.`,
    vocabulary: [
      { word: 'Renewable', ipaOrTone: '/rɪˈnjuːəbl/', meaning: 'Có thể tái tạo (năng lượng)' },
      { word: 'Inexhaustible', ipaOrTone: '/ˌɪnɪɡˈzɔːstəbl/', meaning: 'Vô tận, không bao giờ cạn kiệt' },
      { word: 'Emissions', ipaOrTone: '/ɪˈmɪʃnz/', meaning: 'Khí thải' },
      { word: 'Substantial', ipaOrTone: '/səbˈstænʃl/', meaning: 'Đáng kể, to lớn' }
    ],
    readingTips: 'Observe linked sounds between consonant-vowel transitions: "transitioning to", "clean and", "make significant".'
  },

  // ==========================================
  // THPT (LỚP 10 - 12) - NGỮ VĂN
  // ==========================================
  {
    id: 'tv-thpt-12-tuyen-ngon',
    title: 'Tuyên ngôn Độc lập (Trích đoạn mở đầu)',
    gradeLevel: 'thpt',
    gradeNumber: 12,
    subject: 'tieng-viet',
    authorOrSource: 'Chủ tịch Hồ Chí Minh - SGK Ngữ văn 12',
    category: 'Văn chính luận mẫu mực',
    speedRecommended: 0.9,
    description: 'Áng văn lập quốc vĩ đại với lập luận thép, đanh thép, trang trọng và đầy tự hào dân tộc.',
    content: `"Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc".

Lời bất hủ ấy ở trong bản Tuyên ngôn Độc lập năm 1776 của nước Mỹ. Suy rộng ra, câu ấy có ý nghĩa là: tất cả các dân tộc trên thế giới đều sinh ra bình đẳng, dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do.

Bản Tuyên ngôn Nhân quyền và Dân quyền của Cách mạng Pháp năm 1791 cũng nói: "Người ta sinh ra tự do và bình đẳng về quyền lợi; và phải luôn luôn được tự do và bình đẳng về quyền lợi".
Đó là những lẽ phải không ai chối cãi được.`,
    vocabulary: [
      { word: 'bất hủ', ipaOrTone: 'Thanh sắc - hỏi', meaning: 'Không bao giờ mất đi, sống mãi cùng thời gian' },
      { word: 'mưu cầu', ipaOrTone: 'Thanh ngang - huyền', meaning: 'Tìm kiếm, phấn đấu để đạt được' },
      { word: 'lẽ phải', ipaOrTone: 'Thanh ngã - hỏi', meaning: 'Chân lý đúng đắn, hợp đạo lý' }
    ],
    readingTips: 'Đọc với giọng đĩnh đạc, hùng hồn, dứt khoát, mang tầm vóc lịch sử thiêng liêng. Chú ý ngắt giọng rõ sau mỗi vế câu khẳng định chân lý.'
  },
  {
    id: 'tv-thpt-12-tay-tien',
    title: 'Tây Tiến (Trích)',
    gradeLevel: 'thpt',
    gradeNumber: 12,
    subject: 'tieng-viet',
    authorOrSource: 'Quang Dũng - SGK Ngữ văn 12',
    category: 'Thơ ca lãng mạn & bi tráng',
    speedRecommended: 0.85,
    description: 'Khắc họa vẻ đẹp hào hoa, bi tráng của đoàn binh Tây Tiến giữa thiên nhiên miền Tây hùng vĩ, hiểm trở.',
    content: `Sông Mã xa rồi Tây Tiến ơi!
Nhớ về rừng núi, nhớ chơi vơi.
Sài Khao sương lấp đoàn quân mỏi,
Mường Lát hoa về trong đêm hơi.

Dốc lên khúc khuỷu dốc thăm thẳm,
Heo hút cồn mây, súng ngửi trời.
Ngàn thước lên cao, ngàn thước xuống,
Nhà ai Pha Luông mưa xa khơi.

Anh bạn dãi dầu không bước nữa,
Gục lên súng mũ bỏ quên đời!
Chiều chiều oai linh thác gầm thét,
Đêm đêm Mường Hịch cọp trêu người.

Nhớ ôi Tây Tiến cơm lên khói,
Mai Châu mùa em thơm nếp xôi.`,
    vocabulary: [
      { word: 'chơi vơi', ipaOrTone: 'Thanh ngang - ngang', meaning: 'Nỗi nhớ da diết không định hình giữa không gian bao la' },
      { word: 'khúc khuỷu', ipaOrTone: 'Thanh sắc - hỏi', meaning: 'Gập ghềnh, quanh co hiểm trở liên tục' },
      { word: 'súng ngửi trời', ipaOrTone: 'Hình ảnh nhân hóa', meaning: 'Độ cao chót vót của đỉnh đèo, thể hiện sự tinh nghịch lạc quan của người lính' }
    ],
    readingTips: 'Câu đầu ngân dài thiết tha như tiếng gọi. Các câu tả dốc đọc dằn giọng, gân guốc. Câu "Nhà ai Pha Luông mưa xa khơi" toàn thanh bằng đọc êm ái, trải dài.'
  },

  // ==========================================
  // THPT (LỚP 10 - 12) - TIẾNG ANH
  // ==========================================
  {
    id: 'en-thpt-12-ai-future',
    title: 'Artificial Intelligence and the Future of Education',
    gradeLevel: 'thpt',
    gradeNumber: 12,
    subject: 'tieng-anh',
    authorOrSource: 'THPT Quốc Gia & IELTS Reading Preparation',
    category: 'Academic Essay & Technology',
    speedRecommended: 1.0,
    description: 'Đoạn văn học thuật luyện thi tốt nghiệp THPT và IELTS với từ vựng C1/B2 và cấu trúc câu phức tạp.',
    content: `Artificial intelligence is rapidly reshaping contemporary educational paradigms across the globe.
Rather than replacing educators, intelligent tutoring systems serve as powerful cognitive augmentations, enabling unprecedented personalization for diverse learning paces.
Adaptive algorithms can diagnose individual misconceptions in real time, curating tailored exercises that reinforce foundational concepts before progressing to advanced problem-solving.

Furthermore, automated speech recognition and synthesis technologies provide language learners with tireless, non-judgmental conversational partners.
Students can refine their phonological accuracy, prosody, and intonation through immediate acoustic feedback.
Nevertheless, pedagogical experts emphasize that human empathy, critical inquiry, and ethical mentorship remain irreplaceable cornerstones of holistic education.`,
    vocabulary: [
      { word: 'Paradigm', ipaOrTone: '/ˈpærədaɪm/', meaning: 'Mô hình, khuôn mẫu' },
      { word: 'Augmentation', ipaOrTone: '/ˌɔːɡmenˈteɪʃn/', meaning: 'Sự gia tăng, bổ trợ năng lực' },
      { word: 'Prosody', ipaOrTone: '/ˈprɒsədi/', meaning: 'Ngữ điệu, âm luật của lời nói' },
      { word: 'Holistic', ipaOrTone: '/həʊˈlɪstɪk/', meaning: 'Toàn diện, tổng thể' }
    ],
    readingTips: 'Maintain clear academic phrasing, breathe at coordinate clauses, and emphasize contrasting transitional adverbs such as "Furthermore" and "Nevertheless".'
  }
];
