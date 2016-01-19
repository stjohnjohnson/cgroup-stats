# cgroup-stats
[![version](https://img.shields.io/npm/v/cgroup-stats.svg)](version)
[![downloads](https://img.shields.io/npm/dt/cgroup-stats.svg)](downloads)
[![build status](https://app.wercker.com/status/69dad692abfba7ef1f1cdcbd1d162792/s "wercker status")](https://app.wercker.com/project/bykey/69dad692abfba7ef1f1cdcbd1d162792)
[![license](https://img.shields.io/npm/l/cgroup-stats.svg)](License)

Node Module for reading [Control Group][cgroup] usage stats


Currently this reads the following data:
 - [memory.usage_in_bytes][memory] - current usage for memory
 - [memory.max_usage_in_bytes][memory] - max memory usage recorded
 - [cpuacct.stat.user][cpuacct] - time spent by tasks of the cgroup in user mode
 - [cpuacct.stat.system][cpuacct] - time spent by tasks of the cgroup in kernel mode

**This only works on Linux operating systems**

## Usage

```javascript
var cgroupStats = require('cgroup-stats');

cgroupStats(function (error, data) {
    console.log(data.memory.usage_in_bytes);
    console.log(data.memory.max_usage_in_bytes);
    console.log(data.cpuacct.stat.user);
    console.log(data.cpuacct.stat.system);
});
```

## License
Code licensed under the MIT license.  See `LICENSE` file for terms.

 [cgroup]: https://en.wikipedia.org/wiki/Cgroups
 [memory]: https://www.kernel.org/doc/Documentation/cgroup-v1/memory.txt
 [cpuacct]: https://www.kernel.org/doc/Documentation/cgroup-v1/cpuacct.txt
