var m4 = m4 || {};

m4.game = new function(){
  this.init = function(){
    this.$gameWrap = m4.$body.find(".gameWrap");
    this.$randomBox = m4.$body.find(".randomBox");
    this.$btnWrap = m4.$body.find(".btnWrap"); 
    this.$btn = this.$btnWrap.find("button");
    this.$resetBtn = m4.$body.find(".resetBtn");
    this.$coinTxt = m4.$body.find(".coinTxt");
    this.scoreCount = 0; //점수
    this.randomLen = 3; //묵찌빠 length
    this.orderIdx = 0; // 랜덤 이미지 z-index값 위한 순서 초기화
    this.coin = 30; //생명력
    m4.log = [];
    
    this.randomManager();
    
    this.$btn.on("click",m4.game.handleClick);
    
    this.$resetBtn.on("click",this.reset);

    if (localStorage.getItem("log") !== null) {
      m4.log = JSON.parse(localStorage.getItem("log"));
      this.scoreCount = m4.log.length;
      this.setHtml();
    }else{
        m4.log = [];
    }
   
  };
  this.randomManager = function(){
    //생명력 setting
    var html="";
    html += "<p>"+"생명력 : "+m4.game.coin+" 개 </p>"
    m4.game.$coinTxt.html(html);

    var arr = []; //0,1,2
    arr = m4.game.shuffleRandom(m4.game.randomLen);

    var html ="";
    for (i=0;i<m4.game.randomLen;i++){
      html += "<li random-key=" + arr[i] +"></li>"
    }

    m4.game.$randomBox.html(html);

    m4.game.$randomLi = m4.$body.find(".randomBox").find("li"); //비동기로 html 넣어서 li 찾아줌

    m4.game.$randomLi.each(function(idx){
      var randomKey = parseInt(m4.game.$randomLi.eq(idx).attr("random-key"));
      m4.game.$randomLi.eq(idx).css({
        "background-position-x":-(randomKey*200), //묵0 찌-200 빠-400
        "background-position-y":0
      });
    });

    m4.game.startMove();
  }

  // 묵찌빠 랜덤
  this.shuffleRandom = function(n){
      var arr = [];
      var temp;
      var rnum;

      for(var i = 0; i < n; i++){
          arr.push(i);
      }

      for(var i = 0; i < arr.length; i++){
          rnum = Math.floor(Math.random() * n);
          temp = arr[i];
          arr[i] = arr[rnum];
          arr[rnum] = temp;
      }
      return arr;
  }

  this.startMove = function(){
    clearInterval(m4.game.sid); // reset 버튼 계속 클릭시 누적되서 clear 시켜줌
    m4.game.sid = setInterval(m4.game.imgMove,100);

  }

  // 랜덤이미지 z-index
  this.imgMove = function(){
    m4.game.$randomLi.removeClass("on");
    m4.game.$randomLi.eq(m4.game.orderIdx).addClass("on");
    
    m4.game.orderIdx ++;

    if (m4.game.orderIdx > m4.game.randomLen-1 ){
      m4.game.orderIdx = 0;
    }
  }


  this.handleClick = function(){
    if (m4.game.coin > 0) { // 생명력 0 보다 클때
      clearInterval(m4.game.sid);
      m4.game.handle = false;

      m4.game.btnKey = parseInt($(this).attr("data-key")); //클릭한 버튼 키값
      
      m4.game.$randomLi.each(function(idx){
        if (m4.game.$randomLi.eq(idx).hasClass("on")){
          m4.game.onRandomKey = parseInt(m4.game.$randomLi.eq(idx).attr("random-key")); //랜덤키값 가져옴
        }
      });

      if (m4.game.btnKey === m4.game.onRandomKey){
        m4.game.message("비겼습니다 ~~","same");
      }else if((m4.game.btnKey === 0 && m4.game.onRandomKey === 2) || (m4.game.btnKey === 1 && m4.game.onRandomKey === 0) || (m4.game.btnKey === 2 && m4.game.onRandomKey === 1)){
        m4.game.message("졌습니다 ㅠ_ㅠ","lose");
      }else if((m4.game.btnKey === 0 && m4.game.onRandomKey === 1) || (m4.game.btnKey === 1 && m4.game.onRandomKey === 2) || (m4.game.btnKey === 2 && m4.game.onRandomKey === 0)){
        m4.game.message("이겼습니다 !!!","win");
        m4.game.log();
      }

    }else{
       alert("생명력을 잃었습니다.");
    }
  }


  this.message = function(message,coinStat){
    alert(message);
    if (coinStat === "lose") {
      m4.game.coin --;
    }
    m4.game.randomManager(); // alert 창 후 reset
  }

  this.log = function(){
    m4.game.scoreCount++;
    m4.log.push({ score:m4.game.scoreCount});
    localStorage.setItem('log', JSON.stringify(m4.log)); //저장
    JSON.parse(localStorage.getItem('log')); //받을때
    m4.game.logHtml(m4.game.scoreCount);
  }

  this.setHtml = function() {
    var html = "";
    for (var i=0;i<m4.log.length;i++){
      html += "<p>"+m4.log[i].score+" 승 하였습니다.</p>";
    }
    $( ".logWrap" ).append(html);
  }

  this.logHtml = function(score){
    var html = "";
    if (score<5) {
      html += "<p>"+score+" 승 하였습니다.</p>";
      $( ".logWrap" ).append(html);
    }else if(score === 5) {
      alert("5승 하셨습니다!! 축하합니다~~");
      m4.game.reset();
    }
      
  }

  this.reset = function(){
    m4.game.scoreCount = 0;
    m4.game.coin = 3;
    m4.game.randomManager();
    localStorage.removeItem("log");
    $( ".logWrap" ).html("");
  }

};

$(function(){
  m4.$body = $("body");
  m4.game.init();
});