import { useState, useRef, useEffect } from "react";
import AttendanceStatCard from "../components/cards/AttendanceStatCard";
import { attendanceApi } from "../services/essApi";
import { useAuth } from "../context/AuthContext";

const OFFICE_LOCATION = {
  lat: 13.0827,   // Default: Chennai coordinates (example)
  lng: 80.2707,
};

const ALLOWED_RADIUS = 50000; // 50km (Large radius for testing purposes)

const MOCK_PHOTO = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"; // Fallback placeholder image

export default function Attendance() {
  const { employee } = useAuth();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [mode, setMode] = useState("normal"); // normal | location | camera
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [todayHours, setTodayHours] = useState("0h 0m");
  const [cameraError, setCameraError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakMs, setTotalBreakMs] = useState(0);
  const [currentBreakType, setCurrentBreakType] = useState(null); 
  const [breaks, setBreaks] = useState([]);

  useEffect(() => {
    let interval;
    if (checkedIn && checkInTime && !breakStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffMs = now - checkInTime - totalBreakMs;
        const totalSeconds = Math.floor(diffMs / 1000);
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const pad = (num) => String(num).padStart(2, '0');
        setElapsedTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [checkedIn, checkInTime, breakStartTime, totalBreakMs]);

  const initialHistory = [
    { date: "Feb 01", checkIn: "09:05 AM", checkOut: "06:02 PM", hours: "8h 57m", status: "Present", photo: null, location: null },
    { date: "Jan 31", checkIn: "09:10 AM", checkOut: "05:55 PM", hours: "8h 45m", status: "Present", photo: null, location: null },
    { date: "Jan 30", checkIn: "-", checkOut: "-", hours: "-", status: "Absent", photo: null, location: null },
  ];

  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    if (!employee?.id) return;
    attendanceApi.getHistory(employee.id).then((res) => {
      const formatted = res.data.map((r) => ({
        date: r.punch_in ? new Date(r.punch_in).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "—",
        checkIn: r.punch_in ? new Date(r.punch_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
        checkOut: r.punch_out ? new Date(r.punch_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active",
        hours: r.punch_out ? `${Math.floor((new Date(r.punch_out) - new Date(r.punch_in)) / 3600000)}h ${Math.floor(((new Date(r.punch_out) - new Date(r.punch_in)) % 3600000) / 60000)}m` : "—",
        status: r.status === "PRESENT" ? "Present" : r.status || "Present",
        photo: null, location: null,
      }));
      setAttendanceHistory(formatted);
      // Detect if currently checked in (last record has no punch_out)
      const last = res.data[0];
      if (last && !last.punch_out && last.punch_in) {
        setCheckedIn(true);
        setCheckInTime(new Date(last.punch_in));
      }
    }).catch(console.error);
  }, [employee]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!videoRef.current) {
        // Wait slightly for DOM if needed
        await new Promise(r => setTimeout(r, 100));
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready before proceeding
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Camera permission denied or not available");
      throw err; // Re-throw to handle in smartCheckIn fallback
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return null;
    
    // Fallback if video isn't actually ready but we forced it
    if (video.videoWidth === 0) {
      console.warn("Video metadata not ready, skipping capture");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);
    
    stopCamera(); // Stop camera immediately after capture
    return imageData;
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          reject("Location permission denied or timed out. Please enable GPS.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const toRad = (x) => (x * Math.PI) / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startBreak = (type) => {
    if (!checkedIn || breakStartTime) return;
    setBreakStartTime(new Date());
    setCurrentBreakType(type);
  };

  const resumeWork = () => {
    if (!breakStartTime) return;
    const now = new Date();
    const breakMs = now - breakStartTime;
    
    const mins = Math.floor(breakMs / 60000);
    
    setBreaks(prev => [...prev, {
      type: currentBreakType,
      duration: `${mins} mins`
    }]);

    setTotalBreakMs(prev => prev + breakMs);
    setBreakStartTime(null);
    setCurrentBreakType(null);
  };

  const calculateHours = (start, end, breakMs = 0) => {
    const diff = end - start - breakMs;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const smartCheckIn = async () => {
    try {
      let loc = null;
      // 📍 Location Mode
      if (mode === "location" || mode === "camera") {
        loc = await getLocation();
        const distance = getDistanceInMeters(loc.lat, loc.lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
        if (distance > ALLOWED_RADIUS) {
          alert(`Check-in Denied ❌\nYou are outside the office range (${Math.round(distance)}m away).`);
          return;
        }
      }

      setPhoto(null);
      let captureResult = null;
      if (mode === "camera") {
        try {
          await startCamera();
          let attempts = 0;
          while (attempts < 30 && (!videoRef.current || videoRef.current.readyState < 2)) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
          }
          captureResult = capturePhoto();
          if (!captureResult) { captureResult = MOCK_PHOTO; setPhoto(MOCK_PHOTO); }
        } catch (e) { captureResult = MOCK_PHOTO; setPhoto(MOCK_PHOTO); }
      }

      // Call backend if employee ID is available
      if (employee?.id) {
        try {
          await attendanceApi.punchIn(employee.id);
        } catch (err) {
          const msg = err.response?.data?.detail || "Punch-in failed";
          if (msg.includes("Already punched in")) {
            alert("You are already checked in!");
            return;
          }
          alert(msg);
          return;
        }
      }

      const now = new Date();
      setCheckedIn(true);
      setCheckInTime(now);
      setLocation(loc);
      setCheckOutTime(null);
      setTodayHours("0h 0m");
      setTotalBreakMs(0);
      setBreakStartTime(null);
      setBreaks([]);

      // Refresh history from backend
      if (employee?.id) {
        attendanceApi.getHistory(employee.id).then((res) => {
          setAttendanceHistory(res.data.map((r) => ({
            date: r.punch_in ? new Date(r.punch_in).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "—",
            checkIn: r.punch_in ? new Date(r.punch_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
            checkOut: r.punch_out ? new Date(r.punch_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active",
            hours: r.punch_out ? `${Math.floor((new Date(r.punch_out) - new Date(r.punch_in)) / 3600000)}h ${Math.floor(((new Date(r.punch_out) - new Date(r.punch_in)) % 3600000) / 60000)}m` : "—",
            status: r.status === "PRESENT" ? "Present" : r.status || "Present",
            photo: null, location: null,
          })));
        }).catch(console.error);
      }

      alert(`Checked in successfully! ✅`);
    } catch (e) { alert(e); }
  };

  const handleCheckOut = async () => {
    if (!checkInTime) { alert("No check-in time found"); return; }

    let finalBreakMs = totalBreakMs;
    let finalBreaks = [...breaks];
    if (breakStartTime) {
      const breakMs = new Date() - breakStartTime;
      finalBreakMs += breakMs;
      finalBreaks.push({ type: currentBreakType, duration: `${Math.floor(breakMs / 60000)} mins` });
    }

    // Call backend if employee ID available
    if (employee?.id) {
      try {
        await attendanceApi.punchOut(employee.id);
      } catch (err) {
        const msg = err.response?.data?.detail || "Punch-out failed";
        alert(msg);
        return;
      }
    }

    const now = new Date();
    setCheckOutTime(now);
    setCheckedIn(false);
    setBreakStartTime(null);
    setCurrentBreakType(null);
    const hoursStr = calculateHours(checkInTime, now, finalBreakMs);
    setTodayHours(hoursStr);

    // Refresh history from backend
    if (employee?.id) {
      attendanceApi.getHistory(employee.id).then((res) => {
        setAttendanceHistory(res.data.map((r) => ({
          date: r.punch_in ? new Date(r.punch_in).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "—",
          checkIn: r.punch_in ? new Date(r.punch_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
          checkOut: r.punch_out ? new Date(r.punch_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active",
          hours: r.punch_out ? `${Math.floor((new Date(r.punch_out) - new Date(r.punch_in)) / 3600000)}h ${Math.floor(((new Date(r.punch_out) - new Date(r.punch_in)) % 3600000) / 60000)}m` : "—",
          status: r.status === "PRESENT" ? "Present" : r.status || "Present",
          photo: null, location: null,
        })));
      }).catch(console.error);
    }

    setTotalBreakMs(0);
    setBreaks([]);
  };

  const exportCSV = () => {
    
    const csv =
      "Date,Check In,Check Out,Hours,Status\n" +
      attendanceHistory
        .map((r) => `${r.date},${r.checkIn},${r.checkOut},${r.hours},${r.status}`)
        .join("\n");

    console.log("CSV content:", csv);

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    console.log("CSV download triggered");
  };

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <div className="flex gap-4 items-center">
          {/* Camera Preview */}
          <div className="relative group">
            {cameraError ? (
              <div className="w-48 h-32 rounded-lg border-2 border-blue-300 bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Mock Feed for Simulator */}
                <img src={MOCK_PHOTO} alt="Simulator" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[1px]" />
                <div className="relative z-10 flex flex-col items-center bg-white/80 p-2 rounded-lg shadow-sm">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Simulator Mode</span>
                  <button 
                    onClick={startCamera}
                    className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 transition-colors"
                  >
                    Retry Hardware
                  </button>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-48 h-32 rounded-lg border-2 border-green-300 object-cover bg-gray-100"
              />
            )}
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${cameraError ? 'bg-blue-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
            onClick={exportCSV}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Export Logs
          </button>
          <button 
            onClick={smartCheckIn}
            disabled={checkedIn}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              checkedIn 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Check In
          </button>
          <button 
            onClick={handleCheckOut}
            disabled={!checkedIn}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !checkedIn 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            Check Out
          </button>
          </div>
        </div>
      </div>
      {/* Mode Selector */}
      <div className="flex gap-3 mb-4 bg-white p-4 rounded-xl shadow-sm items-center">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider mr-2">Mode:</span>
        {["normal", "location", "camera"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
              mode === m 
                ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
            }`}
          >
            {m === "normal" && "Normal"}
            {m === "location" && "📍 Location"}
            {m === "camera" && "📷 Camera + GPS"}
          </button>
        ))}
      </div>

      {/* Current Status Card */}
      {(checkedIn || checkOutTime) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-3">Today's Status</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check In</p>
              <p className="text-lg font-bold text-green-600">
                {checkInTime ? formatTime(checkInTime) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check Out</p>
              <p className="text-lg font-bold text-red-600">
                {checkOutTime ? formatTime(checkOutTime) : checkedIn ? 'Active' : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hours Worked</p>
              <p className="text-lg font-bold text-blue-600">
                {checkedIn ? elapsedTime : todayHours}
              </p>
            </div>
          </div>
          {checkedIn && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${breakStartTime ? 'bg-orange-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
                  <span className={`text-sm font-medium ${breakStartTime ? 'text-orange-600' : 'text-green-600'}`}>
                    {breakStartTime ? `On ${currentBreakType} Break` : 'Currently Working'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {!breakStartTime ? (
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button 
                        onClick={() => startBreak("Lunch")}
                        className="text-[11px] bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-orange-300 hover:text-orange-600 transition-all font-semibold shadow-sm"
                      >
                        🍱 Lunch
                      </button>
                      <button 
                        onClick={() => startBreak("Tea")}
                        className="text-[11px] bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-orange-300 hover:text-orange-600 transition-all font-semibold shadow-sm"
                      >
                        ☕ Tea
                      </button>
                      <button 
                        onClick={() => startBreak("Personal")}
                        className="text-[11px] bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-orange-300 hover:text-orange-600 transition-all font-semibold shadow-sm"
                      >
                        🚶 Personal
                      </button>
                      <button 
                        onClick={() => startBreak("Other")}
                        className="text-[11px] bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-orange-300 hover:text-orange-600 transition-all font-semibold shadow-sm"
                      >
                        🔘 Other
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={resumeWork}
                      className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md flex items-center gap-1"
                    >
                      ▶ Resume Work
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <AttendanceStatCard title="Present Days" value="18" />
        <AttendanceStatCard title="Absent Days" value="2" />
        <AttendanceStatCard title="Leave Days" value="3" />
      </div>

      {/* History Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Attendance History</h3>

        <table className="w-full text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2">Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Mode</th>
              <th>Breaks</th>
              <th>Proof</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map((r, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 font-medium">{r.date}</td>
                <td className="text-green-600">{r.checkIn}</td>
                <td className="text-red-600">{r.checkOut}</td>
                <td>{r.hours}</td>
                <td className={r.status === "Present" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {r.status}
                </td>
                <td className="capitalize text-sm font-medium text-gray-600">{r.mode || "Normal"}</td>
                <td>
                  <div className="flex flex-col gap-1">
                    {r.breaks && r.breaks.length > 0 ? r.breaks.map((b, idx) => (
                      <span key={idx} className="text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-100 whitespace-nowrap">
                        {b.type}: {b.duration}
                      </span>
                    )) : <span className="text-gray-400 text-xs">-</span>}
                  </div>
                </td>
                <td>
                  {r.photo ? (
                    <div className="flex flex-col gap-1">
                      <img src={r.photo} alt="proof" className="w-16 h-12 rounded border object-cover" />
                      {r.location && (
                        <span className="text-xs text-gray-500">
                          📍 {r.location.lat.toFixed(4)}, {r.location.lng.toFixed(4)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
