export const images = {
  mountain: "/MediaGalleryProject/assets/media/media-119.jpg",
  concrete: "/MediaGalleryProject/assets/media/media-098.jpg",
  video: "/MediaGalleryProject/assets/media/media-058.jpg",
  audio: "/MediaGalleryProject/assets/media/media-040.jpg",
  avatar: "/MediaGalleryProject/assets/media/media-080.jpg"
};

export const mediaItems = [
  {id:1,type:"image",title:"Рассвет на плато Бермамыт",category:"Фотографии",author:"Дмитрий К.",date:"Сегодня, 08:30",image:images.mountain,description:"Первые лучи солнца над горным плато и туманным морем."},
  {id:2,type:"video",title:"Введение в CSS Grid и Flexbox",category:"Обучение",author:"Михаил Сорокин",date:"Вчера, 19:20",image:images.video,duration:"14:20",description:"Практический курс по современной адаптивной верстке."},
  {id:3,type:"audio",title:"Synthwave Midnight Drive",category:"Музыка",author:"Kavinsky Beat",date:"3 дня назад",image:images.audio,duration:"03:42",description:"Атмосферный электронный саундтрек для ночных поездок."},
  {id:4,type:"image",title:"Геометрия бетона",category:"Фотографии",author:"Ольга Радова",date:"5 дней назад",image:images.concrete,description:"Минималистичная архитектурная серия строгих форм и теней."},
  {id:5,type:"video",title:"Дикая Исландия: Путешествие на север",category:"Развлечения",author:"Артем Васильев",date:"12 мая",image:images.mountain,duration:"05:48",description:"Аэросъемка ледников, черных пляжей и водопадов."},
  {id:6,type:"audio",title:"Lo-Fi Beats & Дизайн-системы",category:"Обучение",author:"Мария Ковалева",date:"8 мая",image:images.audio,duration:"45:10",description:"Подкаст о дизайн-системах под расслабляющий бит."},
  {id:7,type:"image",title:"Макромир: Утренняя роса",category:"Фотографии",author:"Сергей Белов",date:"5 мая",image:images.mountain,description:"Макросъемка капель росы в мягком утреннем свете."},
  {id:8,type:"video",title:"Flow Dynamics",category:"Развлечения",author:"Денис Корнеев",date:"1 мая",image:images.video,duration:"01:15",description:"Экспериментальная кинетическая анимация."}
];

export const typeLabel = {
  image: "ИЗОБРАЖЕНИЕ",
  video: "ВИДЕО",
  audio: "АУДИО"
};
