extern crate user32;
extern crate kernel32;
extern crate winapi;
extern crate wmi;
#[macro_use]
extern crate error_chain;
#[macro_use]
extern crate hado;
mod errors;
use errors::*;
use std::{thread, time};
extern crate chrono;
use chrono::prelude::*;
extern crate hostname;


fn main() {
    loop {
        Report::get().report();
        thread::sleep(time::Duration::from_secs(1));
    }
}

#[derive(Debug)]
struct Report {
    report_type:ReportType,
    time: DateTime<Local>,
    reporter:String,
    id:String,
    content:ReportContent
}

impl Report {
    pub fn get() ->Self {
        match ReportData::try_get() {
            Ok(data) => {
                Report{
                    report_type:ReportType::TickInfo,
                    time:Local::now(),
                    reporter:format!("windows-{}",get_host_name()),
                    id:get_id(),
                    content:ReportContent::Data(data)
                }
            },
            Err(e) => {
                Report{
                    report_type:ReportType::Error,
                    time:Local::now(),
                    reporter:format!("windows-{}",get_host_name()),
                    id:get_id(),
                    content:ReportContent::Error(e.to_string())
                }
            }
        }
    }

    pub fn report(&self) {
        println!("{} {:?}",self.time,self.content);
    }
}

#[derive(Debug)]
enum ReportType {
    TickInfo,
    Error,
}
#[derive(Debug)]
enum ReportContent {
    Data(ReportData),
    Error(String),
}

#[derive(Debug)]
struct ReportData {
    title:String,
    name:String,
    executable_path:String,
}

impl ReportData {
    pub fn try_get()->Result<Self> {
        use wmi::process::*;
        hado!{
            f_info <- get_foreground_window_info();
            process <- Process::find_by_pid(f_info.pid).chain_err(||"get process by pid err");
            Ok(ReportData{
                title:f_info.title.clone(),
                name:process.name,
                executable_path:process.executable_path,
            })
        }
    }
}



#[derive(Debug)]
struct ForegroundWindow {
    pub title:String,
    pub pid:u32,
}


fn get_foreground_window_info()->Result<ForegroundWindow>{
    use winapi::minwindef::DWORD;

    unsafe {
        let handle = user32::GetForegroundWindow();
        let pid_ptr:* mut u32 = [DWORD::default()].as_mut_ptr();
        let mut data:[u16;1024] = [0;1024];
        let p:*mut u16=data.as_mut_ptr();
        let length:usize = user32::GetWindowTextW(handle,p,1024) as usize;
        let _ = user32::GetWindowThreadProcessId(handle,pid_ptr);
        let pid:u32 = *pid_ptr;
        let s =  String::from_utf16(&data[0..length]);
        Ok((s,pid))
    }.and_then(|pair|{
        let title = pair.0;
        let pid = pair.1;
        let title:String = title.chain_err(||"get title decode err")?;
        Ok(ForegroundWindow{
            title:title,
            pid:pid,
        })
    })
}

fn get_host_name()->String {
    hostname::get_hostname().unwrap_or("unknow".to_owned())
}

fn get_id()->String{
    return format!("{:?}",std::env::current_exe())[0..10].to_owned();
}