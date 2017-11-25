use wmi;
error_chain!{
    links {
        WmiError(wmi::errors::Error,wmi::errors::ErrorKind);
    }
}