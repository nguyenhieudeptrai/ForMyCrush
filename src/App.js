import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { Heart } from "./Heart";

const audio = new Audio(window.location.href + "img/bg.mp3");

function App() {

  const [status, setStatus] = useState("LOADDING");
  const [breakHeart, setBreakHeart] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("NOT_ACCEPT") == "true") {
      setBreakHeart(true);
    }
  }, []);

  const onLoadDone = () => {
    if (localStorage.getItem("THIS_IS_MY_CRUSH") == "true") {
      setStatus("DANG_NHI_2");
      audio.currentTime = 0;
      audio.loop = true;
      audio.play();
    } else if (localStorage.getItem("THIS_IS_MY_CRUSH") == "false") {
      setStatus("THANK2");
    } else {
      setStatus("VERIFY");
    }
  }

  const thisIsHer = () => {
    audio.currentTime = 0;
    audio.loop = true;
    audio.play();
    localStorage.setItem("THIS_IS_MY_CRUSH", "true");
    setStatus("DANG_NHI");
  }

  const thisIsHerSpecial = () => {
    audio.currentTime = 0;
    audio.play();
    localStorage.setItem("THIS_IS_MY_CRUSH", "true");
    setStatus("DANG_NHI_2");
  }

  const notHer = () => {
    window.localStorage.setItem("THIS_IS_MY_CRUSH", "false");
    setStatus("THANK");
  }

  const onReset = () => {
    localStorage.removeItem("THIS_IS_MY_CRUSH");
    setStatus("VERIFY");
    audio.currentTime = 0;
    if(audio.paused){
      audio.play();
    }
  }
  if (breakHeart) {
    return (<div className="min-h-screen w-screen relative flex flex-wrap overflow-hidden items-center justify-center bg-black">
      <img src={window.location.href + "img/t10.png"} alt=""
        className="h-40" />
      <motion.p
        initial={{ width: 0 }}
        animate={{ width: 250, }}
        className="whitespace-nowrap overflow-hidden"
      >
        Hãy nhắn cho anh biết điều này
      </motion.p>
    </div>)
  }
  if (window.innerWidth < 800) {
    return (<div className="min-h-screen w-screen relative flex overflow-hidden items-center justify-center bg-black">
      <img src={window.location.href + "img/t11.png"} alt=""
        className="h-40 m-2" />
      Hãy mở trang web này ở trên Laptop hoặc chế độ máy tính trên điện thoại bằng Chrome!
    </div>)
  }


  return (
    <div className="min-h-screen w-screen relative flex">
      <p className="absolute top-0 left-0 text-[10px] text-white">From Nguyễn Hiếu Đẹp Trai</p>
      {status == "LOADDING" &&
        <Loading onDone={onLoadDone} />
      }
      {status == "VERIFY" &&
        <Verify notHer={notHer} normalAccept={thisIsHer} accept={thisIsHerSpecial} />
      }
      {status == "DANG_NHI" &&
        <DangNhi
          isMormal onDone={onReset}
          notAccept={() => {
            setBreakHeart(true);
            window.localStorage.setItem("NOT_ACCEPT", "true");
            audio.pause();
          }} />
      }
      {status == "DANG_NHI_2" &&
        <DangNhi onDone={onReset} notAccept={() => {
          setBreakHeart(true);
          window.localStorage.setItem("NOT_ACCEPT", "true");
          audio.pause();
        }} />
      }
      {status == "THANK" &&
        <Thank />
      }
      {status == "THANK2" &&
        <Thank2 />
      }
    </div>
  );
}


const Loading = ({ onDone }) => {

  const [isStart, setStart] = useState(false);
  const [t, setT] = useState(0);
  const currentHeart = useRef([]);


  useEffect(() => {
    waiting();
  }, []);

  useEffect(() => {
    if (isStart && t < 100) {
      load();
    }
  }, [isStart, t]);

  const waiting = () => {
    Promise.all(Array(11).fill("").map((_, i) => loadImage("h" + (i + 1) + ".png"))).then((imgs) => {

      currentHeart.current = imgs
      setStart(true);
    })
  }

  const loadImage = (filename) => new Promise((r) => {
    let link = window.location.href + "img/" + filename;
    let img = new Image();
    img.onload = () => {
      r(link);
    }
    img.src = link;
  })

  const load = () => {
    setTimeout(() => {
      setT(p => p + 10);
    }, Math.floor(Math.random() * 500) + 200)
  }

  if (!isStart) return (<div id="load-bg" className="flex-1" />)
  return (
    <div id="load-bg" className="flex flex-1 items-center justify-center">
      {isStart &&
        <div className="flex flex-col pt-20 w-3/4 relative items-center">
          {t > 0 &&
            <Heart className={"absolute top-0 left-0 h-16 -translate-x-1/2"} imgs={currentHeart.current} />
          }
          {t > 60 &&
            <Heart className={"absolute top-0 left-[60%] h-16 -translate-x-1/2"} imgs={currentHeart.current} />
          }
          {t == 100 &&
            <Heart className={"absolute top-0 right-0 h-16 translate-x-1/2"} imgs={currentHeart.current} />
          }
          <div className="w-full border-4 rounded-lg border-black/60 h-20 relative flex items-center px-2">
            <div className="line-bg h-5/6 rounded-md transition-all duration-500" style={{ backgroundImage: `url('${window.location.href}img/line.png')`, width: t + "%" }} />
          </div>
          {t < 100 &&
            <motion.p className="text-black text-5xl leading-[4rem] font-bold mt-6 text-center"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
            >
              Chờ 1 xí si nheee...<br />😉😉😉
            </motion.p>
          }
          {t == 100 &&
            <motion.button className="text-black text-5xl leading-[4rem] font-bold mt-12 text-center border-[4px] rounded-lg px-20 border-black"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              onClick={() => onDone()}
            >
              OKKK!
            </motion.button>
          }
        </div>

      }
    </div>
  )
}

const Verify = ({ accept, normalAccept, notHer }) => {

  useEffect(() => {

  }, []);

  return (
    <motion.div className="flex-1 flex items-center justify-center relative overflow-hidden"
      initial={{
        background: "linear-gradient(0deg, #fdd7ef 0%, #fe9994 60%)",
      }}
      animate={{
        background: "linear-gradient(225deg, #fabd8e 0%, #8dcbfa 60%)",
        transition: { duration: 0.5 }
      }}
    >
      <motion.div className="">
        <p className="font-custom text-black text-6xl mb-16 text-center font-semibold">Bạn có phải là <span className="text-violet-500">Đặng Nhi</span>?</p>
        <div className="flex flex-col items-center relative mb-16">
          <div className="h-48 relative  hover:scale-[4] transition-transform z-20">
            <motion.img src={window.location.href + "img/dang-nhi.jpg"} alt=""
              className="h-full object-contain rounded-lg border-4 border-rose-500"
              initial={{ x: -400, y: 40, opacity: 0, scale: 1, rotate: -100 }}
              animate={{ x: [-200, 0, 0, 0], y: 0, opacity: [0, 1, 1], scale: [1, 1.8, 2.1, 2.1, 2.1, 1.4, 1], rotate: [-100, 0, 0, -10], transition: { duration: 1.2, easings: ["backInOut"] } }}

            />
            <motion.img src={window.location.href + "img/point.png"} alt=""
              className="h-30 object-contain absolute top-9 left-3/4"
              initial={{ x: 60, opacity: 0, rotate: 60 }}
              animate={{ x: 0, opacity: 1, rotate: 0, transition: { delay: 1.5 } }}
            />
            <motion.p
              className="text-red-500 font-custom text-3xl font-medium absolute left-[155%] top-[7%] w-56"
              initial={{ y: 10, opacity: 0, rotate: 60 }}
              animate={{ x: 0, opacity: 1, rotate: 10, transition: { delay: 1.8 } }}>
              Chính là cô gái dễ thương này!
            </motion.p>
          </div>
        </div>
        <motion.div
          className="flex justify-between space-x-5"
          initial={{ y: 200, opacity: 0, }}
          animate={{ y: 0, opacity: 1, transition: { delay: 3 } }}

        >
          <div className="relative ">
            <div className="absolute top-0 -inset-5">
              <div
                className="w-full h-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600">
              </div>
            </div>
            <button className="text-3xl relative inline-flex items-center justify-center min-h-[100px] px-8 py-4 font-bold text-white transition-all duration-200 bg-gray-600 font-custom rounded-xl focus:outline-none hover:bg-blue-500"
              onClick={notHer}
            >
              Không phải
              &nbsp;<span className="font-sans">😢</span>
            </button>
          </div>
          <div className="w-[10vw]" />
          <div className="relative">
            <div className="absolute top-0 -inset-5">
              <div
                className="w-full h-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600">
              </div>
            </div>
            <button className="text-3xl relative inline-flex items-center justify-center min-h-[100px] px-8 py-4 font-bold text-white transition-all duration-200 bg-gray-600 font-custom rounded-xl focus:outline-none hover:bg-rose-600"
              onClick={normalAccept}
            >
              Đúng ròi hỏi nhìu
            </button>
          </div>
          <div className="relative">
            <div className="absolute top-0 -inset-5">
              <div
                className="w-full h-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600">
              </div>
            </div>
            <button className="text-3xl relative inline-flex items-center justify-center min-h-[100px] px-8 py-4 font-bold text-black transition-all duration-200  border-4 border-black font-custom rounded-xl focus:outline-none hover:bg-rose-600 hover:cus:text-white"
              onClick={accept}
            >
              Chắc chắn
              &nbsp;<span className="font-sans">😍</span>
            </button>
          </div>
        </motion.div>
      </motion.div >
    </motion.div >
  )
}

const DangNhi = ({ onDone, isMormal, notAccept, }) => {
  const [index, setIndex] = useState(24);
  const [mode, setMode] = useState(false);
  const [deg, setDeg] = useState(0);
  const timeline = [
    [2, isMormal ? "Helloooo, anh chỉ hỏi vậy thui." : "Anh biết ngay là em mà!!!", null, false,],
    [2, "My \"công chúa\"", null, false],
    [2, "Đây là trang web dành riêng cho em", null, false],
    [2, "First-time I see you", null, false],
    [2, null, "t2", false],
    [2, "I had crush you..............! 😍😍", null, false],
    [2, null, "t1", false],
    [2, "Nhưng chắc là em không biết", null, false],
    [2, null, "t4", false],
    [2, "Trước lúc đó...", null, false],
    [3, "Anh hơi ngại, mà cũng hơi sợ...", "t9", false],
    [3, "Khi mà đến lúc bắt đầu nói chuyện...", null, false],
    [3, "Anh muốn thử nói chuyện nhiều hơn", null, false],
    [3, "Mãi đến khi có một 'gợi ý'", null, false],
    [2, null, "t11", false],
    [3, "Thì anh muốn biết nhiều về em...", null, false],
    [2, "Muốn gặp em nữa...", null, false],
    [3, "Chỉ sợ em không thích thôi...", null, false],
    [3, "Nhưng anh muốn hỏi emmmm...", null, false],
    [2, "Có phải chỉ có anh crush em thui hem...\nHay em cũng thích anh?????", "t6", 5, "text-[0.2rem]"],
    [2, "Mừng gheeeeeeeeeeeeeeeeeeee!", null, false],
    [2, "Mừng gheeeeeeeeeeeeeeeeeeee x2!", "t3", false],
    [2, "Chính em!", null, false],
    [2, "Đặng Nguyễn Tuyết Nhi", null, 1, "text-[3rem]"],
    [2, null, "t5", false],
    [2, "Lặp lại phải không?", null, 2],
    [2, "Chính em!", null, false],
    [4, "Đặng Nguyễn Tuyết Nhi", null, false, "text-[5rem] animate-ping"],
    [3, "👍😍❤️💖💕💕💕", null, false, "text-[6rem] leading-[1.5]"],
    [2, "Lặp lại 1 lần nữa?", null, 2],
    [2, "我喜欢你", null, false, "text-[6rem]"],
    [2, "Lặp thêm 1 lần lại nữa?", null, 2],
    [4, "私はあなたが好きです", null, false, "text-[6rem]"],
    [2, "Nhi-san", null, false, "text-[6rem]"],
    [2, "Thôi nhé", null, 3],
    [2, "Thank for reading! Like you 😘🥰...\n\nQ & A", null, 4, "text-[5rem] text-black font-sans leading-[1.5]"],
  ]

  useEffect(() => {
    changeBg();
  }, [deg]);

  const changeBg = () => {
    setTimeout(() => {
      setDeg(Math.floor(Math.random() * 359));
    }, 6000);
  }


  useEffect(() => {
    if (index < timeline.length && timeline[index][3] === false) {
      loop();
    }
  }, [index]);

  const loop = () => {
    if (index == 0) {
      setMode(true)
    }
    setTimeout(() => {
      setMode(false);
      setTimeout(() => {
        setMode(true);
        setIndex(index + 1);
      }, 200)
    }, timeline[index][0] * 1000)
  }

  const onHover = () => {

  }
  const movePosition = () => {
    var btn = document.getElementById("notButton");
    if (btn.className.includes("absolute")) {
      btn.classList.remove("absolute");
    }
    btn.style.position = "fixed";
    btn.style.left = Math.floor(Math.random() * (window.innerWidth - 400)) + "px";
    btn.style.top = Math.floor(Math.random() * (window.innerHeight - 40)) + "px";
  }
  return (
    <motion.div className="flex-1 flex items-center justify-center"
      initial={{
        background: "linear-gradient(225deg, #fabd8e 0%, #8dcbfa 60%)",
      }}
      animate={{
        background: `linear-gradient(${deg}deg, #fdd7ef 0%, #fe9994 60%)`,
        transition: { duration: 0.5 }
      }}
    >
      <div className="relative text-center flex flex-col items-center">
        <div className={"relative text-4xl text-center font-black font-main transition-all duration-300 " + (mode ? "a-up" : "a-down")} >
          {timeline[index][1] && <>
            <p className={timeline[index][4] + " whitespace-pre-wrap"}>{timeline[index][1]}</p>
            <p className={timeline[index][4] + " whitespace-pre-wrap animate-none absolute top-0 w-full"}>{timeline[index][1]}</p>
          </>}
          {timeline[index][2] && <>
            <img src={window.location.href + "img/" + timeline[index][2] + ".png"} alt=""
              className="h-60 object-contain mx-auto mt-8"
            />
          </>}
        </div>
        {timeline[index][3] == 1 &&
          <motion.button
            className="font-second font-bold text-4xl border-[3px] px-5 py-2 rounded-lg border-indigo-500 text-indigo-600 mt-12"
            onClick={() => setIndex(index + 1)}
          >
            Tiếp đi
          </motion.button>
        }
        {timeline[index][3] == 2 &&
          <div className="flex items-center w-[1010px] max-w-[100vw] mx-8 relative mt-12">
            <div id="notButton" className="absolute left-0 top-0 transition-all" >
              <motion.button
                className="group p-10 cursor-pointer relative border-0 flex items-center justify-center bg-transparent text-black h-auto w-[300px] overflow-hidden transition-all duration-100 text-4xl font-semibold font-sans"
                onClick={() => movePosition()}
                onMouseOver={() => movePosition()}
              >
                <span className="group-hover:w-full absolute left-0 h-full w-5 border-y-4 border-l-4 border-black transition-all duration-500" />
                <span className="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200">
                  Không muốn
                </span>
                <span
                  className="group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200  font-bold font-sans">
                  :((!
                </span>
                <span className="group-hover:w-full absolute right-0 h-full w-5 border-y-4 border-r-4 border-black transition-all duration-500" />
              </motion.button>
            </div>
            <div className="absolute right-0 top-0">
              <motion.button
                className="group p-10 cursor-pointer relative border-0 flex items-center justify-center bg-transparent text-purple-600 overflow-hidden w-[300px] transition-all duration-100 text-4xl font-semibold font-sans"
                onClick={() => setIndex(index + 1)}
              >
                <span className="group-hover:w-full absolute left-0 h-full w-5 border-y-4 border-l-4 border-purple-600 transition-all duration-500" />
                <span className="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200">
                  Uhhhhh
                </span>
                <span
                  className="group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200">
                  OK!
                </span>
                <span className="group-hover:w-full absolute right-0 h-full w-5 border-y-4 border-r-4 border-purple-600 transition-all duration-500" />
              </motion.button>
            </div>
          </div>
        }
        {timeline[index][3] == 3 &&
          <div className="flex items-center w-[800px] max-w-[100vw] mx-8 relative mt-12">
            <div className="absolute left-0 top-0 transition-all" >
              <motion.button
                className="group p-10 cursor-pointer relative border-0 flex items-center justify-center bg-transparent text-black h-auto w-[300px] overflow-hidden transition-all duration-100 text-4xl font-semibold font-sans"
                onClick={() => setIndex(timeline.length - 1)}
              >
                <span className="group-hover:w-full absolute left-0 h-full w-5 border-y-4 border-l-4 border-black transition-all duration-500" />
                <span className="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200">
                  Ừa
                </span>
                <span
                  className="group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200  font-bold font-sans">
                  :((!
                </span>
                <span className="group-hover:w-full absolute right-0 h-full w-5 border-y-4 border-r-4 border-black transition-all duration-500" />
              </motion.button>
            </div>
            <div className="absolute right-0 top-0">
              <motion.button
                className="group p-10 cursor-pointer relative border-0 flex items-center justify-center bg-transparent text-purple-600 overflow-hidden w-[300px] transition-all duration-100 text-4xl font-semibold font-sans"
                onClick={() => setIndex(1)}
              >
                <span className="group-hover:w-full absolute left-0 h-full w-5 border-y-4 border-l-4 border-purple-600 transition-all duration-500" />
                <span className="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200">
                  Hong - tiếp đi...
                </span>
                <span
                  className="group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200">
                  Tiếp đi!
                </span>
                <span className="group-hover:w-full absolute right-0 h-full w-5 border-y-4 border-r-4 border-purple-600 transition-all duration-500" />
              </motion.button>
            </div>
          </div>
        }
        {timeline[index][3] == 4 &&
          <div className="flex items-center w-[400px] relative mt-12">
            <motion.button
              className="group p-16 cursor-pointer relative border-0 flex items-center justify-center bg-transparent text-black h-auto w-[400px] overflow-hidden transition-all duration-100 text-4xl font-semibold font-sans"
              onClick={() => onDone()}
            >
              <span className="group-hover:w-full absolute left-0 h-full w-5 border-y-4 border-l-4 border-black transition-all duration-500" />
              <span className="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200">
                Xem lại từ đầu
                <br />
                <i className="text-xl">Hãy chọn lời thật lòng nheee</i>
              </span>
              <span
                className="group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200  font-bold font-sans">
                :D
              </span>
              <span className="group-hover:w-full absolute right-0 h-full w-5 border-y-4 border-r-4 border-black transition-all duration-500" />
            </motion.button>
          </div>
        }
        {timeline[index][3] == 5 &&
          <div className="flex items-center w-[600px] relative mt-12">
            <div className="absolute left-0 top-0 transition-all" >
              <motion.button
                className="group p-10 cursor-pointer relative border-0 flex items-center justify-center bg-transparent text-black h-auto w-[200px] overflow-hidden transition-all duration-100 text-4xl font-semibold font-sans"
                onClick={() => notAccept()}
              >
                <span className="group-hover:w-full absolute left-0 h-full w-5 border-y-4 border-l-4 border-black transition-all duration-500" />
                <span className="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200">
                  Không
                </span>
                <span
                  className="group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200  font-bold font-sans">
                  :((!
                </span>
                <span className="group-hover:w-full absolute right-0 h-full w-5 border-y-4 border-r-4 border-black transition-all duration-500" />
              </motion.button>
            </div>
            <div className="absolute right-0 top-0">
              <motion.button
                className="group p-10 cursor-pointer relative border-0 flex items-center justify-center bg-transparent text-purple-600 overflow-hidden w-[300px] transition-all duration-100 text-4xl font-semibold font-sans"
                onClick={() => setIndex(index + 1)}
              >
                <span className="group-hover:w-full absolute left-0 h-full w-5 border-y-4 border-l-4 border-purple-600 transition-all duration-500" />
                <span className="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-200">
                  Có
                </span>
                <span
                  className="group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full opacity-0 transition-all duration-200">
                  Tiếp đi!
                </span>
                <span className="group-hover:w-full absolute right-0 h-full w-5 border-y-4 border-r-4 border-purple-600 transition-all duration-500" />
              </motion.button>
            </div>
          </div>
        }
      </div>
    </motion.div>
  )
}
const Thank = ({ }) => {

  useEffect(() => {
    localStorage.setItem("TIME_REIVEW", 1);
  }, []);

  return (
    <motion.div className="flex-1 flex items-center justify-center relative overflow-hidden text-black"
      initial={{
        background: "linear-gradient(225deg, #fabd8e 0%, #8dcbfa 60%)",
      }}
      animate={{
        background: "linear-gradient(20deg, #8efbcc 0%, #d3d888 100%)",
        transition: { duration: 0.5 }
      }}
    >
      <p className="text-3xl ">
        Cảm ơn bạn đã tham quan trang web này....
        <br />
        Trang này chỉ dành cho <span className="font-bold text-orange-500">Đặng Nhi</span> thoi!!!
      </p>
    </motion.div>
  )
}

const Thank2 = ({ }) => {

  useEffect(() => {
    localStorage.setItem("TIME_REIVEW", +localStorage.getItem("TIME_REIVEW") + 1);
  }, []);

  return (
    <motion.div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden text-black text-center"
      initial={{
        background: "linear-gradient(0deg, #fdd7ef 0%, #fe9994 60%)",
      }}
      animate={{
        background: "linear-gradient(225deg, #8efbcc 0%, #d3d888 100%)",
        transition: { duration: 0.5 }
      }}
    >
      <p className="text-3xl">
        Cảm ơn bạn đã tham quan trang web này....
        <br />
        Trang này chỉ dành cho <span className="font-bold text-orange-500">Đặng Nhi</span> thoi!!!
        <br />
        Không vào trang này nữa nhé, lần thứ {localStorage.getItem("TIME_REIVEW")} rồi đó
      </p>
      <br />
      <br />
      <p><i>(Đây là 1 cô gái xinh sắn mà tôi crush không phải bạn)</i></p>
    </motion.div>
  )
}
export default App;
