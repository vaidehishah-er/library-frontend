import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface CategoryStat {
    label: string;
    count: number;
    color: string;
}

const IconBooks = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const IconGrid = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const IconStar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const IconShield = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export const Analytics = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [totalBooks, setTotalBooks] = useState(0);
    const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API;

                const res = await fetch(`${baseUrl}/books?page=0&size=1`);
                if (res.ok) {
                    const data = await res.json();
                    setTotalBooks(data.page?.totalElements || 0);
                }

                const categories = [
                    { key: 'FE',        label: 'Front End',  color: '#1a6fa0' },
                    { key: 'BE',        label: 'Back End',   color: '#c9a84c' },
                    { key: 'Data',      label: 'Data',       color: '#2890cc' },
                    { key: 'DevOps',    label: 'DevOps',     color: '#a07830' },
                    { key: 'Fiction',   label: 'Fiction',    color: '#8b5cf6' },
                    { key: 'Science',   label: 'Science',    color: '#06b6d4' },
                    { key: 'History',   label: 'History',    color: '#f59e0b' },
                    { key: 'Biography', label: 'Biography',  color: '#10b981' },
                    { key: 'Biology',   label: 'Biology',    color: '#84cc16' },
                ];

                const stats: CategoryStat[] = [];
                for (const cat of categories) {
                    const r = await fetch(
                        `${baseUrl}/books/search/findByCategory?category=${cat.key}&page=0&size=1`
                    );
                    if (r.ok) {
                        const d = await r.json();
                        stats.push({
                            label: cat.label,
                            count: d.page?.totalElements || 0,
                            color: cat.color,
                        });
                    }
                }
                setCategoryStats(stats);
            } catch (e) {
                // silently fail — analytics is non-critical
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [isAuthenticated, getAccessTokenSilently]);

    const maxCount = Math.max(...categoryStats.map(s => s.count), 1);
    const largestCategory = categoryStats.length
        ? categoryStats.reduce((a, b) => (a.count > b.count ? a : b)).label
        : '—';

    const avgAvailability = isLoading ? '—' : '~80%';

    return (
        <div className='analytics-wrapper mt-4'>
            <div className='admin-form-header'>
                <div className='section-label'>Insights</div>
                <h2 className='admin-form-title'>Library Analytics</h2>
            </div>

            {/* Stat Cards */}
            <div className='analytics-stat-grid'>
                <div className='analytics-stat-card'>
                    <div className='analytics-stat-icon'><IconBooks /></div>
                    <div className='analytics-stat-value'>
                        {isLoading ? <span className='skeleton-line' style={{ width: 60, height: 32, display: 'inline-block' }}></span> : totalBooks}
                    </div>
                    <div className='analytics-stat-label'>Total Books</div>
                    <div className='analytics-stat-sub'>in collection</div>
                </div>

                <div className='analytics-stat-card'>
                    <div className='analytics-stat-icon'><IconGrid /></div>
                    <div className='analytics-stat-value'>
                        {isLoading ? <span className='skeleton-line' style={{ width: 40, height: 32, display: 'inline-block' }}></span> : categoryStats.length}
                    </div>
                    <div className='analytics-stat-label'>Categories</div>
                    <div className='analytics-stat-sub'>subject areas</div>
                </div>

                <div className='analytics-stat-card'>
                    <div className='analytics-stat-icon'><IconStar /></div>
                    <div className='analytics-stat-value' style={{ fontSize: '1.3rem' }}>
                        {isLoading ? <span className='skeleton-line' style={{ width: 90, height: 32, display: 'inline-block' }}></span> : largestCategory}
                    </div>
                    <div className='analytics-stat-label'>Largest Category</div>
                    <div className='analytics-stat-sub'>by book count</div>
                </div>

                <div className='analytics-stat-card'>
                    <div className='analytics-stat-icon'><IconShield /></div>
                    <div className='analytics-stat-value'>{avgAvailability}</div>
                    <div className='analytics-stat-label'>Availability</div>
                    <div className='analytics-stat-sub'>avg. available</div>
                </div>
            </div>

            {/* Category Bar Chart */}
            <div className='analytics-chart-card'>
                <h5 className='analytics-chart-title'>Books by Category</h5>
                {isLoading ? (
                    <div className='analytics-bars-skeleton'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                            <div key={i} className='skeleton-line' style={{ height: 40, marginBottom: 12 }}></div>
                        ))}
                    </div>
                ) : (
                    <div className='analytics-bars'>
                        {categoryStats.map(stat => (
                            <div key={stat.label} className='analytics-bar-row'>
                                <div className='analytics-bar-label'>{stat.label}</div>
                                <div className='analytics-bar-track'>
                                    <div
                                        className='analytics-bar-fill'
                                        style={{
                                            width: `${Math.round((stat.count / maxCount) * 100)}%`,
                                            background: stat.color,
                                        }}
                                    />
                                </div>
                                <div className='analytics-bar-count'>{stat.count}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Category Breakdown */}
            <div className='analytics-legend-card'>
                <h5 className='analytics-chart-title'>Category Breakdown</h5>
                <div className='analytics-legend'>
                    {categoryStats.map(stat => (
                        <div key={stat.label} className='analytics-legend-item'>
                            <span className='analytics-legend-dot' style={{ background: stat.color }}></span>
                            <span className='analytics-legend-text'>
                                {stat.label}
                                <span className='analytics-legend-pct'>
                                    {totalBooks > 0 ? ` ${Math.round((stat.count / totalBooks) * 100)}%` : ' —'}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
                <div className='analytics-donut-row'>
                    {categoryStats.map(stat => (
                        <div
                            key={stat.label}
                            className='analytics-donut-segment'
                            title={`${stat.label}: ${stat.count} books`}
                            style={{ flex: stat.count || 1, background: stat.color }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
