'use strict';

// 스크롤시 Navbar에 클래스 추가
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});

// Navbar 링크 클릭시 이동
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link === null) {
    return;
  }
  // 링크 클릭시 열려있는 navbarMenu 닫고 이동
  navbarMenu.classList.remove('open');
  scrollIntoView(link);
  selectNavItem(target);
});

// Navar 반응형 토글 버튼 클릭시 화면
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
});

// Contact Me 클릭시 화면 이동
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
  scrollIntoView('#contact');
});

// 스크롤시 home 화면 투명도 조정
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// 스크롤시 arrow up 버튼 생성/삭제
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

// arrow up 버튼 클릭시 home으로 이동
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

// Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  console.log(filter);
  if (filter === null || filter === undefined) {
    return e.preventDefault();
  }

  //클릭된 카테고리 버튼을 selected로 변경 후 이전 selected는 삭제
  const active = document.querySelector('.category__btn.selected');
  active.classList.remove('selected');
  const target =
    e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
  target.classList.add('selected');

  projectContainer.classList.add('anim-out');
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });
    projectContainer.classList.remove('anim-out');
  }, 300);
});

// 프로젝트 개수
const projectFront = document.querySelectorAll(
  '.project[data-type = "front-end"]'
);
const projectMobile = document.querySelectorAll(
  '.project[data-type = "mobile"]'
);
const categoryCount = document.querySelector('.category__count');
const frontCount = document.querySelector('.front_count');
const mobileCount = document.querySelector('.mobile_count');

categoryCount.innerHTML = projects.length;
frontCount.innerHTML = projectFront.length;
mobileCount.innerHTML = projectMobile.length;

// 페이지 이동시 navbar에 보고있는 화면으로 표시
const sectionIds = ['#home', '#about', '#skills', '#work', '#contact'];

const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);

// 현재 navitems 값 저장
let selectedNavIndex = 0;
let selectedNavItem = navItems[selectedNavIndex];
// 이전 navitems 삭제후 현재 보는 화면 값으로 저장

function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

//해당 화면으로 이동 함수
function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
  // 스무스하게 이동
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤링이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

// 스크롤링 할때 메뉴아이템 선택
window.addEventListener('wheel', () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) ===
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});
